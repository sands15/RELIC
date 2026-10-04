"""Build the public, derived paper catalog from one JSON file per review."""
import argparse
from datetime import datetime
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

TEXT = ('title','summary','category','paperTitle','authors','year','venue','paperUrl','codeUrl','coverUrl','coverAlt','body')
ID = re.compile(r'(?!index\Z)[a-z0-9][a-z0-9-]{0,79}\Z')

def valid_url(value):
    try:
        u=urlsplit(value)
        return u.scheme in ('http','https') and bool(u.hostname) and not u.username and not u.password
    except ValueError:
        return False

def validate(r):
    if not isinstance(r,dict) or r.get('version') != 1 or not isinstance(r.get('id'),str) or not ID.fullmatch(r['id']):
        raise ValueError('Invalid review version or address')
    for field in TEXT:
        if not isinstance(r.get(field),str) or len(r[field]) > (200000 if field == 'body' else 2000):
            raise ValueError(f'Invalid field: {field}')
    for field in ('title','paperTitle','body','paperUrl'):
        if not r[field].strip(): raise ValueError(f'Missing field: {field}')
    if not isinstance(r.get('tags'),list) or len(r['tags']) > 20 or any(not isinstance(t,str) or not t.strip() or len(t)>80 for t in r['tags']):
        raise ValueError('Invalid tags')
    for field in ('paperUrl','codeUrl','coverUrl'):
        if r[field] and not valid_url(r[field]): raise ValueError(f'Invalid URL: {field}')
    if r['year'] and not re.fullmatch(r'\d{4}',r['year']): raise ValueError('Invalid paper year')
    for field in ('publishedAt','updatedAt'):
        if not isinstance(r.get(field),str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z',r[field]):
            raise ValueError(f'Invalid date: {field}')
        datetime.fromisoformat(r[field].replace('Z','+00:00'))
    if r['updatedAt'] < r['publishedAt']: raise ValueError('Update date precedes publication')

def build(source, output):
    source,output=Path(source),Path(output)
    reviews=[]
    for file in sorted(source.glob('*.json')):
        if file.name == 'index.json':
            if file.is_symlink() or file.stat().st_size > 2_000_000 or not isinstance(json.loads(file.read_text(encoding='utf-8-sig')), list):
                raise ValueError('index.json is reserved for the derived catalog')
            continue
        if file.is_symlink() or file.stat().st_size > 2_000_000: raise ValueError(f'Invalid review file: {file.name}')
        try:
            r=json.loads(file.read_text(encoding='utf-8-sig'))
            validate(r)
            if file.stem != r['id']: raise ValueError('Filename and review address differ')
        except (ValueError,KeyError,TypeError) as e:
            raise ValueError(f'{file.name}: {e}') from e
        reviews.append({k:r[k] for k in ('id','title','summary','category','tags','paperTitle','year','coverUrl','coverAlt','publishedAt','updatedAt')})
    reviews.sort(key=lambda r:r['id'])
    reviews.sort(key=lambda r:r['publishedAt'],reverse=True)
    output.parent.mkdir(parents=True,exist_ok=True)
    temp=output.with_name(output.name+'.tmp')
    temp.write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    temp.replace(output)
    print(f'PAPER_CATALOG_OK reviews={len(reviews)}')

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',default='papers')
    parser.add_argument('--output',default='_site/papers/index.json')
    args=parser.parse_args()
    build(args.source,args.output)
