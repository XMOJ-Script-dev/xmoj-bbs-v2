import sanitizeHtml from 'sanitize-html';

export function sanitizeRichText(input: string): string {
  if (!input) return "";
  
  // Use sanitize-html with strict configuration to prevent XSS
  // All sanitization is delegated to the well-tested library
  // Do not add custom regex filtering as it can introduce new attack vectors
  return sanitizeHtml(input, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'div': ['class'],
      'span': ['class'],
      'code': ['class'],
      'pre': ['class']
    },
    allowedSchemes: ['https', 'mailto'],
    allowedSchemesByTag: {
      'img': ['https']
    },
    allowedClasses: {
      'code': ['language-javascript', 'language-python', 'language-cpp', 'language-c', 'language-java', 'hljs'],
      'pre': ['hljs'],
      'div': ['code-block'],
      'span': ['mention']
    },
    // Disallow relative URLs
    allowProtocolRelative: false,
    // Remove all disallowed tags and their content
    disallowedTagsMode: 'recursiveEscape',
    // Enforce closing tags
    enforceHtmlBoundary: true,
    // Nest block elements properly
    nestingLimit: 50,
    // Normalize HTML during parsing
    parser: {
      lowerCaseAttributeNames: true,
      lowerCaseTags: true
    },
    // Automatically add rel="noopener noreferrer" to links with target="_blank"
    transformTags: {
      'a': (tagName: string, attribs: Record<string, string>) => {
        // Validate href doesn't contain javascript: or data: schemes
        if (attribs.href && /^(javascript|data|vbscript|file|about):/i.test(attribs.href)) {
          // Remove unsafe href
          delete attribs.href;
        }
        
        const rel = attribs.rel || '';
        const relParts = new Set(rel.split(/\s+/).filter(Boolean));
        
        // If target is _blank, ensure noopener and noreferrer are present
        if (attribs.target === '_blank') {
          relParts.add('noopener');
          relParts.add('noreferrer');
        }
        
        return {
          tagName,
          attribs: {
            ...attribs,
            rel: Array.from(relParts).join(' ')
          }
        };
      },
      'img': (tagName: string, attribs: Record<string, string>) => {
        // Validate src and ensure it's https only
        if (attribs.src && !/^https:\/\//.test(attribs.src)) {
          delete attribs.src;
        }
        return {
          tagName,
          attribs
        };
      }
    }
  });
}
