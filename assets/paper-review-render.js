(function(root){
  'use strict';
  const M=typeof module!=='undefined'&&module.exports?require('./paper-review-model.js'):root.PaperReview;
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function inline(text){
    const pattern=/(!?\[([^\]\n]*)\]\(([^)\s]+)\)|`([^`\n]+)`|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*)/g;
    let html='',end=0;
    for(const match of text.matchAll(pattern)){
      html+=escape(text.slice(end,match.index)); end=match.index+match[0].length;
      if(match[2]!==undefined){
        const url=M.safeUrl(match[3]);
        html+=url?(match[0][0]==='!'?`<img src="${escape(url)}" alt="${escape(match[2])}" loading="lazy" referrerpolicy="no-referrer">`:`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(match[2])}</a>`):escape(match[0]);
      }else if(match[4]!==undefined)html+='<code>'+escape(match[4])+'</code>';
      else if(match[5]!==undefined)html+='<strong>'+escape(match[5])+'</strong>';
      else html+='<em>'+escape(match[6])+'</em>';
    }
    return html+escape(text.slice(end));
  }
  function markdown(text){
    const lines=String(text).replace(/\r\n?/g,'\n').split('\n');let html='',i=0,heading=0;
    while(i<lines.length){
      const line=lines[i];if(!line.trim()){i++;continue;}
      if(/^```/.test(line)){
        const code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);
        i++;html+='<pre><code>'+escape(code.join('\n'))+'</code></pre>';continue;
      }
      const title=line.match(/^(#{1,4})\s+(.+)$/);
      if(title){const level=Math.max(2,title[1].length);html+=`<h${level} id="section-${++heading}">${inline(title[2])}</h${level}>`;i++;continue;}
      if(/^\s*---+\s*$/.test(line)){html+='<hr>';i++;continue;}
      if(/^>\s?/.test(line)){const quote=[];while(i<lines.length&&/^>\s?/.test(lines[i]))quote.push(inline(lines[i++].replace(/^>\s?/,'')));html+='<blockquote>'+quote.join('<br>')+'</blockquote>';continue;}
      if(/^\s*(?:[-*]|\d+\.)\s+/.test(line)){
        const ordered=/^\s*\d+\./.test(line),tag=ordered?'ol':'ul',pattern=ordered?/^\s*\d+\.\s+/:/^\s*[-*]\s+/;
        html+='<'+tag+'>';while(i<lines.length&&pattern.test(lines[i]))html+='<li>'+inline(lines[i++].replace(pattern,''))+'</li>';html+='</'+tag+'>';continue;
      }
      if(line.includes('|')&&i+1<lines.length&&/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i+1])){
        const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(s=>s.trim());
        html+='<div class="table-scroll"><table><thead><tr>'+cells(line).map(c=>'<th>'+inline(c)+'</th>').join('')+'</tr></thead><tbody>';i+=2;
        while(i<lines.length&&lines[i].includes('|')&&lines[i].trim())html+='<tr>'+cells(lines[i++]).map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>';
        html+='</tbody></table></div>';continue;
      }
      const figure=line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if(figure&&M.safeUrl(figure[2])){html+='<figure>'+inline(line.trim())+'<figcaption>'+escape(figure[1])+'</figcaption></figure>';i++;continue;}
      const paragraph=[inline(line)];i++;
      while(i<lines.length&&lines[i].trim()&&!/^(?:#{1,4}\s|```|>\s?|\s*(?:[-*]|\d+\.)\s|---+$)/.test(lines[i]))paragraph.push(inline(lines[i++]));
      html+='<p>'+paragraph.join('<br>')+'</p>';
    }
    return html;
  }
  const api={escape,inline,markdown};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PaperReviewRender=api;
})(globalThis);
