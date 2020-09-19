import parse, { TokentoString } from "../core/parse";
import isString from "../typechecking/isString";
import isPlainObject from "../typechecking/isPlainObject";
import { BrowserSupportedPseudo, BrowserSupportedOperators, Traversals } from "../vars";
import core from "../core";
import isUndefined from "../typechecking/isUndefined";

/**
 * Converts CSS Pasred Object into queryable Data.
 * @param selector
 * @return {*[][]}
 */
export default function( selector ) {
	return parse( selector ).map( ( tokens ) => {
		const renderedSelectors = [];
		let selector            = [];
		const store             = ( data ) => {
			if( isString( data ) ) {
				selector.push( data );
			} else if( isPlainObject( data ) ) {
				renderedSelectors.push( selector.join( '' ) );
				renderedSelectors.push( data );
				selector = [];
			}
		};


		tokens.map( token => {
			let type = token.type;
			if( 'tag' === type ) {
				store( token.name );
			} else if( 'descendant' === type ) {
				store( ' ' );
			} else if( 'attribute' === type ) {
				if( 'id' === token.name || 'class' === token.name && token.action === 'element' ) {
					let element_type = ( 'id' === token.name ) ? '#' : '.';
					store( element_type );
					store( token.value );
				} else if( BrowserSupportedOperators.indexOf( token.action ) >= 0 ) {
					store( TokentoString( token ) );
				} else {
					store( token );
				}
			} else if( Traversals.indexOf( type ) >= 0 ) {
				selector.push( ` ${type} ` );
			} else if( 'pseudo' === type ) {
				store( token );
			}
		} );

		renderedSelectors.push( selector.join( '' ) );
		return renderedSelectors.filter( value => ( '' !== value ) );
	} );
}