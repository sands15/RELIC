import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'tools' / 'build-paper-reviews.py'

def fixture(ident='test', **changes):
    result = dict(version=1, id=ident, title='Synthetic review', summary='Test', category='LLM', tags=['test'], paperTitle='Synthetic paper', authors='', year='2020', venue='', paperUrl='https://example.org/paper', codeUrl='', coverUrl='', coverAlt='', body='Synthetic body', publishedAt='2026-01-01T00:00:00.000Z', updatedAt='2026-01-01T00:00:00.000Z')
    result.update(changes)
    return result

class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue(SCRIPT.exists(), 'catalog builder has not been implemented')
        spec = importlib.util.spec_from_file_location('paper_catalog', SCRIPT)
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)

    def test_canonical_files_generate_latest_first_without_body_duplication(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); (root/'papers').mkdir()
            (root/'papers'/'a.json').write_text(json.dumps(fixture('a')), encoding='utf-8')
            (root/'papers'/'b.json').write_text(json.dumps(fixture('b', publishedAt='2026-09-01T00:00:00.000Z', updatedAt='2026-09-01T00:00:00.000Z')), encoding='utf-8')
            out = root/'site'/'papers'/'index.json'
            self.module.build(root/'papers', out)
            rows = json.loads(out.read_text(encoding='utf-8'))
            self.assertEqual([r['id'] for r in rows], ['b','a'])
            self.assertNotIn('body', rows[0])

    def test_invalid_review_does_not_replace_existing_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); (root/'papers').mkdir()
            (root/'papers'/'evil.json').write_text(json.dumps(fixture('evil',paperUrl='javascript:alert(1)')),encoding='utf-8')
            out=root/'index.json'; out.write_text('original',encoding='utf-8')
            with self.assertRaises(ValueError): self.module.build(root/'papers',out)
            self.assertEqual(out.read_text(encoding='utf-8'),'original')

    def test_filename_must_match_review_address(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); (root/'x.json').write_text(json.dumps(fixture('other')),encoding='utf-8')
            with self.assertRaises(ValueError): self.module.build(root,root/'index.json')

    def test_empty_collection_is_real_empty_state(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); (root/'papers').mkdir()
            self.module.build(root/'papers',root/'index.json')
            self.assertEqual(json.loads((root/'index.json').read_text()),[])

    def test_review_cannot_silently_occupy_reserved_catalog_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); (root/'index.json').write_text(json.dumps(fixture('index')),encoding='utf-8')
            with self.assertRaises(ValueError): self.module.build(root,root/'output.json')

if __name__ == '__main__': unittest.main()
