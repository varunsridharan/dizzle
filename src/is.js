import parse from "./parser/parse";
import matcher from "./selector/matcher";
import attrHandler from "./selector/attr";
import pesudoHandler from "./selector/pseudo";

export default function is( elem, selector ) {
	try {
		return matcher( elem, selector );
	} catch( e ) {
		return parse( selector ).reduce( ( results, tokens ) => {
			let i       = 0,
				len     = tokens.length,
				context = elem;
			while( i < len ) {
				let token = tokens[ i++ ];

				if( context ) {
					switch( token.type ) {
						case 'attr':
							if( !attrHandler( context, token ) ) {
								context = false;
							}
							break;
						case 'pseudo':
							context = pesudoHandler( context, token );
							break;
					}
				}
			}

			return ( context ) ? true : false;
		}, true );
	}

}
