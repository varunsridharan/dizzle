export const reName      = /^[^\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/,
			 reEscape    = /\\([\da-f]{1,6}\s?|(\s)|.)/gi,
			 // Modified version of https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L87
			 reAttr      = /^\s*((?:\\.|[\w\u00b0-\uFFFF-])+)\s*(?:(\S?)=\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00b0-\uFFFF-])*)|)|)\s*(i)?\]/,
			 // Easily-parseable/retrievable ID or TAG or CLASS selectors
			 rquickExpr  = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			 whitespace  = "[\\x20\\t\\r\\n\\f]",
			 rwhitespace = new RegExp( whitespace + "+", "g" );