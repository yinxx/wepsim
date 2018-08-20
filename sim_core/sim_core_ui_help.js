/*
 *  Copyright 2015-2018 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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


     function request_html_url ( r_url )
     {
        var robj = null ;

	if (false == is_mobile()) 
        {
            if (navigator.onLine) 
                 robj = fetch(r_url);
            else robj = caches.match(r_url).then() ;
        }
        else 
        { 
            robj = $.ajax(r_url, { type: 'GET', dataType: 'html' }) ;
        }

        return robj ;
     }

     function update_div_frompartialhtml ( helpdiv, key, data )
     {
	var default_content = '<br>Sorry, No more details available for this element.<p>\n' ;
	var help_content    = default_content ;

	if ("" != data) 
	{
		help_content = $(data).find('#' + key).html() ;
		if (typeof help_content == "undefined") {
		    help_content = $(data).filter('#' + key).html() ;
		}
		if (typeof help_content == "undefined") {
		    help_content = default_content ;
		}
	}

	$(helpdiv).html(help_content) ;
	$(helpdiv).trigger('create');
     }

     function update_signal_loadhelp ( helpdiv, simhw, key )
     {
	     var curr_idiom = get_cfg('ws_idiom') ;
	     var help_base = 'help/' + simhw + '/signals-' + curr_idiom + '.html' ;

               var robj = request_html_url(help_base) ;
               robj.then(function (data) {
                            if (typeof data == "object")
                                 data.text().then(function(res){update_div_frompartialhtml(helpdiv, key, res);}) ;
                            else update_div_frompartialhtml(helpdiv, key, data) ;
	 	         }) ;

             ga('send', 'event', 'help', 'help.signal', 'help.signal.' + simhw + '.' + key);
     }

     function update_checker_loadhelp ( helpdiv, key )
     {
          var curr_idiom = get_cfg('ws_idiom') ;
  	  var help_base = 'help/simulator-' + curr_idiom + '.html' ;

               var robj = request_html_url(help_base) ;
               robj.then(function (data) {
                            if (typeof data == "object")
                                 data.text().then(function(res){update_div_frompartialhtml(helpdiv, key, res);}) ;
                            else update_div_frompartialhtml(helpdiv, key, data) ;
	 	         }) ;

          ga('send', 'event', 'help', 'help.checker', 'help.checker.' + key);
     }

