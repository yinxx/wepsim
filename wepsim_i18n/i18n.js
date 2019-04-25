/*
 *  Copyright 2015-2019 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
 *
 *  This file is part of WepSIM.
 *
 *  WepSIM is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WepSIM is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


    /*
     * Initialize...
     */

    var i18n = {
	          lang:  {
			    es: "Espa&ntilde;ol", 
			    en: "English" 
		         },
	          eltos: { 
                            // main-screen user interface
			    gui: {}, 
			    // configuration dialog
			    cfg: {}, 
			    // examples dialog
			    examples: {}, 
			    // states dialog
			    states: {},
			    // help dialog
			    help: {} 
		         }
               } ;

    // tutorials
    var tutorials = {} ;
        tutorials.welcome = {} ;
        tutorials.welcome.en = [] ;
        tutorials.welcome.es = [] ;
        tutorials.simpleusage = {} ;
        tutorials.simpleusage.en = [] ;
        tutorials.simpleusage.es = [] ;

    // tour
    var tour_steps = {} ;


    /*
     *  i18n Private Interface
     */

    function i18n_init ( )
    {
	for (var l in i18n.lang) 
	{
	     for (var e in i18n.eltos) 
             {
	          i18n.eltos[e][l] = {} ;
	     }
	}

	return true ;
    }

    i18n_init() ;


    /*
     *  i18n Public Interface
     */

    function i18n_update_tags ( component )
    {
        var ws_idiom = get_cfg('ws_idiom') ;

        i18n_update_tagsFor(component, ws_idiom) ;
    }

    function i18n_update_tagsFor ( component, lang )
    {
        if (typeof i18n.eltos[component] == "undefined") {
	    return ;
	}

	var tags = document.querySelectorAll('span') ;

	Array.from(tags).forEach(function(value, index) {
                         	     var key = value.dataset.langkey ;
                         	     if (i18n.eltos[component][lang][key]) {
                                         value.innerHTML = i18n.eltos[component][lang][key] ;
				     }
                         	 }) ;
    }

    function i18n_get ( component, lang, key )
    {
	return i18n.eltos[component][lang][key] ;
    }


    function i18n_get_dropdown ( components, post_code )
    {
        var o = '' ;

	for (var l in i18n.lang)
	{
           o += ' <a class="dropdown-item" href="#"' +
                '    onclick="set_cfg(\'ws_idiom\',\'' + l + '\'); save_cfg();' ;
	   for (var i=0; i<components.length; i++)
	   {
           o += '             i18n_update_tags(\'' + components[i] + '\', \'' + l + '\') ;' ;
	   }
	   o += post_code ;
           o += '             return false;">' + l.toUpperCase() + '<span class="d-none d-sm-inline-flex">&nbsp;(' + i18n.lang[l] + ')</span>' + 
	        '</a>' ;
	}

	return o ;
    }
