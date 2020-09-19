import isString from "../typechecking/isString";

export function stringifyToken( token ) {
	let { type, id, val, igCase, action, data } = token;
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
			return id;
		case 'pseudo-element':
			return `::${id}`;
		case 'pseudo':
			if( data === null ) {
				return `:${id}`;
			}
			if( isString( data ) ) {
				return `:${id}(${data})`;
			}
			return `:${id}(${TokentoString( data )})`;
		case 'attr':
			if( action === 'exists' ) {
				return `[${id}]`;
			}
			if( id === 'id' && action === 'equals' && !igCase ) {
				return `#${val}`;
			}
			if( id === 'class' && action === 'element' && !igCase ) {
				return `.${val}`;
			}
			return `[${id}${action}'${val}'${igCase ? 'i' : ''}]`;
	}
}

export function TokentoString( tokens ) {
	return tokens.map( ( token ) => token.map( stringifyToken ).join( '' ) ).join( ', ' );
}