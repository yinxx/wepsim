/*
 *  Copyright 2015-2021 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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


    //  tour + tours definitions
        ws_info.tours = {} ;
    var ws_tour = null ;

    // tour API
    function wepsim_newbie_tour ( )
    {
	     // setup lang
	     var ws_idiom = get_cfg('ws_idiom') ;
             wepsim_newbie_tour_setLang(ws_idiom) ;

	     // setup tour
             if (null == ws_tour) {
	         ws_tour = introJs() ;
             }

	     ws_tour.setOptions({
                                steps:              ws_info.tours.tour1,
				keyboardNavigation: true,
				tooltipClass:       'tooltip-large',
				showProgress:       true,
				showStepNumbers:    true,
				scrollToElement:    true,
                                nextLabel:          i18n_get('gui', ws_idiom, 'Next'),
                                prevLabel:          i18n_get('gui', ws_idiom, 'Prev.'),
	                        overlayOpacity:     '0.2'
                             }) ;

	     ws_tour.onbeforechange(function () {
                                        ws_info.tours.tour1[this._currentStep].do_before() ;
	                         }) ;

	     ws_tour.onexit(function () {
			                $("#help1").modal('hide');
				        wsweb_dialog_close('examples');
				        wsweb_dialog_close('config');

					// ws_mode: intro, tutorial, ep, poc, ...
					if (get_cfg('ws_mode') != 'ep') {
					    wsweb_select_main('ep') ;
					}

			                return true ;
	                }) ;

	     ws_tour.start() ;

	     // stats about ui
             ga('send', 'event', 'ui', 'ui.tour', 'ui.tour.newbie');
    }

    function wepsim_newbie_tour_setLang ( lang )
    {
	     var step = '' ;
	     for (var i=0; i<ws_info.tours.tour1.length; i++) 
	     {
		  step = ws_info.tours.tour1[i].step ;
                  if ("" !== step) {
		      ws_info.tours.tour1[i].intro = i18n.eltos.tour_intro[lang][step] ;
                  }
	     }
    }

    function wepsim_newbie_tour_reload ( lang )
    {
	     // save idiom
             set_cfg('ws_idiom', lang) ;
	     save_cfg() ;

	     // update interface
	     i18n_update_tags('gui') ;

	     wepsim_newbie_tour() ;
    }

