import isString from "../typechecking/isString";

export function stringifyToken( token ) {
	let { type, name, val, igCase, action, data } = token;
	switch( type ) {
		// Simple types
		case '>':
		case '<':
		case '~':
		case '+':
		case '*':
			return ` ${type} `;
		case 'descendant':
			return ' ';
		case 'tag':
			return name;
		case 'pseudo-element':
			return `::${name}`;
		case 'pseudo':
			if( data === null ) {
				return `:${name}`;
			}
			if( isString( data ) ) {
				return `:${name}(${data})`;
			}
			return `:${name}(${TokentoString( data )})`;
		case 'attr':
			if( action === 'exists' ) {
				return `[${name}]`;
			}
			if( name === 'id' && action === 'equals' && !igCase ) {
				return `#${val}`;
			}
			if( name === 'class' && action === 'element' && !igCase ) {
				return `.${val}`;
			}
			return `[${name}${action}'${val}'${igCase ? 'i' : ''}]`;
	}
}

export function TokentoString( tokens ) {
	return tokens.map( ( token ) => token.map( stringifyToken ).join( '' ) ).join( ', ' );
}