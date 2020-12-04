/*
 *  Copyright 2015-2020 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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
         *  Registers (Register file + transparent registers)
         */

        /* jshint esversion: 6 */
        class ws_registers extends HTMLElement
        {
	      constructor ()
	      {
		    // parent
		    super();

                    this.rf_div = "states_BR" ;
                    this.tf_div = "states_ALL" ;
	      }

	      render ( msg_default )
	      {
                    // html holder
		    var o1 = "<div class='container text-right'>" +
		             "<a data-toggle='popover-rfcfg' id='popover-rfcfg' " +
			     "   tabindex='0' class='m-auto show multi-collapse-3'>" + 
                             "<strong><strong class='fas fa-wrench text-secondary'></strong></strong>" + 
                             "</a>" +
                             "</div>" +
                             '<div id="' + this.tf_div + '" ' +
                             '     style="width:inherit; overflow-y:auto;"' +
                             '     class="container container-fluid px-1 pb-1">' +
                             '</div>' +
                             '<div id="' + this.rf_div + '" ' +
                             '     style="width: inherit; overflow-y: auto;"' +
                             '     class="container container-fluid px-1 pt-1">' +
                             '</div>' ;

                    this.innerHTML = o1 ;

                    // initialize loaded components
		    $("[data-toggle=popover-rfcfg]").popover({
			    html:      true,
			    placement: 'auto',
			    animation: false,
			    trigger:   'click',
			    template:  '<div class="popover shadow" role="tooltip">' +
				       '<div class="arrow"></div>' +
				       '<h3  class="popover-header"></h3>' +
				       '<div class="popover-body"></div>' +
				       '</div>',
			    container: 'body',
			    content:    quick_config_rf,
			    sanitizeFn: function (content) {
					   return content ; // DOMPurify.sanitize(content) ;
					}
		    }).on('shown.bs.popover',
					function(shownEvent) {
					    i18n_update_tags('cfg') ;
					    i18n_update_tags('dialogs') ;
					}) ;
	      }

	      connectedCallback ()
	      {
		    this.render('') ;
	      }
        }

        if (typeof window !== "undefined") {
            window.customElements.define('ws-registers', ws_registers) ;
        }


        /*
         *  Auxiliar to init_x & show_x
         */

        function hex2values_update ( index )
        {
              var sim_eltos = simhw_sim_states() ;
	      var new_value = parseInt($("#popover1")[0].value) ;

              if (typeof sim_eltos.BR[index] != "undefined")
              {
	          set_value(sim_eltos.BR[index], new_value) ;
                  $("#rf" + index).click() ;
                  $("#rf" + index).click() ;
              }

              if (typeof sim_eltos[index] != "undefined")
              {
                  if (1 == sim_eltos[index].nbits) {
                      new_value = new_value % 2;
                  }

	          set_value(sim_eltos[index], new_value) ;
                  $("#rp" + index).click() ;
                  $("#rp" + index).click() ;
              }
        }

        function hex2values ( hexvalue, index )
        {
                var rhex = /[0-9A-F]{1,8}/gi;
                if (!rhex.test(hexvalue)) {
                    hexvalue = 0 ;
		}

		var valueui  = hexvalue >>> 0 ;
		var valuec8  = hex2char8(valueui) ;
                var valueoct = "0"  + valueui.toString(8).toUpperCase() ;
                var valuehex = valueui.toString(16).toUpperCase() ;
                    valuehex = "0x" + simcoreui_pack(valuehex, 8) ;

		var o2 = "" ;
		if (get_cfg('is_editable') == true)
		{
		    o2 = "<tr><td class='py-1 px-1' colspan='5' align='center'>" +
                         "<input type='text' id='popover1' value='" + valueui + "' data-mini='true' " + 
                         "       style='width:65%'>&nbsp;" +
                         "<span class='badge badge-secondary shadow' " +
                         "      onclick='hex2values_update(\"" + index + "\");'>update</span>" +
                         "</td></tr>";
                }

		var TD_B   = "<td class='p-0 pl-1 align-middle'>" ;
                var TD_E   = "</td>" ;
                var SG_B2  = "<strong class='rounded text-dark' " +
                             "        style='background-color:#CEECF5; font-family:monospace; font-size:105%'>" ;
		var TD_B1  = TD_B + "<strong>" ;
                var TD_B2  = TD_B + SG_B2 ;
                var TD_E12 = "</strong>" + TD_E ;
                var VAL_B  = SG_B2 + "&nbsp;" ;
                var VAL_E  = "&nbsp;</strong>&nbsp;" ;

		var o1 = "<table class='table table-bordered table-hover table-sm mb-1'>" +
			 "<tbody>" +
			 "<tr>" + TD_B1 + "hex."   + TD_E12 + TD_B2 + valuehex         + TD_E12 + "</tr>" +
			 "<tr>" + TD_B1 + "oct."   + TD_E12 + TD_B2 + valueoct         + TD_E12 + "</tr>" +
			 "<tr>" + TD_B1 + "binary" + TD_E12 + TD_B2 + hex2bin(valueui) + TD_E12 + "</tr>" +
			 "<tr>" + TD_B1 + "signed" + TD_E12 + TD_B2 + (hexvalue  >> 0) + TD_E12 + "</tr>" +
			 "<tr>" + TD_B1 + "unsig." + TD_E12 + TD_B2 + valueui          + TD_E12 + "</tr>" +
			 "<tr>" + TD_B1 + "char"   + TD_E12 +
                                  TD_B + VAL_B + valuec8[0] + VAL_E + VAL_B + valuec8[1] + VAL_E +
			                 VAL_B + valuec8[2] + VAL_E + VAL_B + valuec8[3] + VAL_E + TD_E +
			 "</tr>" +
			 "<tr>" + TD_B1 + "float"  + TD_E12 + TD_B2 + hex2float(valueui) + TD_E12 + "</tr>" +
			 o2 +
			 "</tbody>" +
			 "</table>" ;

		return o1;
        }

           function quick_config_rf_htmlformat ( label1, format1, label2, format2 )
           {
	      var o1 = "" ;

               if (label1 === "")
	         o1 += "<div class='col-7 p-1'></div>" ;
               else
	         o1 += "<div class='col-7 p-1'>" +
		       "<buttom class='btn btn-sm btn-outline-secondary col p-1 text-right float-right' " +
		       "        onclick='update_cfg(\"RF_display_format\", \"" + format1 + "\"); " +
                       "                 wepsim_refresh_registers();" +
                       "                 return true; '>" +
		       "<span class='mx-auto px-1 font-weight-bold rounded text-dark' style='background-color:#CEECF5; '>" + label1 + "</span></buttom>" +
		       "</div>" ;

               if (label2 === "")
	         o1 += "<div class='col-7 p-1'></div>" ;
               else
		 o1 += "<div class='col p-1'>" +
		       "<buttom class='btn btn-sm btn-outline-secondary col p-1 text-right float-right' " +
		       "        onclick='update_cfg(\"RF_display_format\", \"" + format2 + "\"); " +
                       "                 wepsim_refresh_registers();" +
                       "                 return true; '>" +
		       "<span class='mx-auto px-1 font-weight-bold rounded text-dark' style='background-color:#CEECF5; '>" + label2 + "</span></buttom>" +
		       "</div>" ;

	       return  o1 ;
           }

           function quick_config_rf_register_names ( )
           {
              var sim_eltos = simhw_sim_states() ;
              var SIMWARE = get_simware() ;

              var logical_defined = [] ;
	      for (var index=0; index < sim_eltos.BR.length; index++)
              {
	         if (typeof SIMWARE.registers[index] !== "undefined") {
                     logical_defined = SIMWARE.registers[index] ;
                 }
              }

	      var o2 = "<div class='col-6 p-1'>" +
                       "<buttom class='btn btn-sm btn-outline-secondary col p-1 text-right float-right' " +
                       "        onclick='update_cfg(\"RF_display_name\", \"numerical\"); " +
                       "                 wepsim_show_rf_names(); return true; '>" +
                       "<span class='font-weight-bold text-monospace'>R10</span>" + "&nbsp;" +
                       "<span class='mx-auto px-1 rounded' style='background-color:#CEECF5;'>0</span></buttom>" +
                       "</div>" +
                       "<div class='col-6 p-1'>" +
                       "</div>" ;

              for (var i=0; i<logical_defined.length; i++) {
                 o2 += "<div class='col-6 p-1'>" +
                       "<buttom class='btn btn-sm btn-outline-secondary col p-1 text-right float-right' " +
                       "        onclick='update_cfg(\"RF_display_name\", \"logical\"); " +
                       "                 wepsim_refresh_rf_names(" + i + "); return true; '>" +
                       "<span class='font-weight-bold text-monospace'>" + logical_defined[i] + "</span>" + "&nbsp;" +
                       "<span class='mx-auto px-1 rounded' style='background-color:#CEECF5;'>0</span></buttom>" +
                       "</div>" ;
              }

	      return o2 ;
           }

        function quick_config_rf ( )
        {
	      return "<div class='container mt-1'>" +
                     "<div class='row'>" +
	               "<div class='col-12 p-0'>" +
                       "<span data-langkey='Display format'>Display format</span>" +
                       "</div>" +
                         quick_config_rf_htmlformat("0x0000001A<sub>16</sub>", "unsigned_16_fill",
                                                    "0x1A<sub>16</sub>",       "unsigned_16_nofill") +
                         quick_config_rf_htmlformat("00000032<sub>8</sub>",    "unsigned_8_fill",
                                                    "032<sub>8</sub>",         "unsigned_8_nofill") +
                         quick_config_rf_htmlformat("00000026<sub>10</sub>",   "unsigned_10_fill",
                                                    "26<sub>10</sub>",         "unsigned_10_nofill") +
                         quick_config_rf_htmlformat("",                        "",
                                                    "3.6e-44<sub>10</sub>",    "float_10_nofill") +
	             "<div class='w-100 border border-light'></div>" +
	               "<div class='col-12 p-0'>" +
                       "<span data-langkey='Register file names'>Register file names</span>" +
                       "</div>" +
                          quick_config_rf_register_names() +
	             "<div class='w-100 border border-light'></div>" +
		       "<div class='col p-1'>" +
		       "<button type='button' id='close' data-role='none' " +
		       "        class='btn btn-sm btn-danger w-100 p-0 mt-1' " +
		       "        onclick='$(\"#popover-rfcfg\").popover(\"hide\");'>" +
                       "<span data-langkey='Close'>Close</span>" +
                       "</button>" +
		       "</div>" +
		     "</div>" +
		     "</div>" ;
        }


        /*
         *  refresh
         */

        function wepsim_refresh_registers ( )
        {
            var sim_eltos = simhw_sim_states() ;
            var ref_obj   = null ;

            // register file
	    for (var index=0; index < sim_eltos.BR.length; index++)
            {
		 ref_obj = sim_eltos.BR[index] ;
		 if (typeof ref_obj.value == "function") {
		     ref_obj.value.valueHasMutated() ;
                 }
            }

            // transparent registers
            var filter_states = simhw_internalState('filter_states') ;

            for (var i=0; i<filter_states.length; i++)
            {
                 var s = filter_states[i].split(",")[0] ;

		 ref_obj = sim_eltos[s] ;
		 if (typeof ref_obj.value == "function") {
		     ref_obj.value.valueHasMutated() ;
                 }
            }
        }

        function wepsim_refresh_rf_names ( logical_index )
        {
	    var disp_name = get_cfg('RF_display_name') ;
            var sim_eltos = simhw_sim_states() ;
            var SIMWARE   = get_simware() ;

            var br_value = "" ;
	    for (var index=0; index < sim_eltos.BR.length; index++)
            {
                 // get name
		 br_value = "R"  + index ;
	         if (
		      ('logical' == disp_name) &&
                      (logical_index >= 0) &&
		      (typeof SIMWARE.registers[index]                !== "undefined") &&
		      (typeof SIMWARE.registers[index][logical_index] !== "undefined")
		    )
		 {
		    br_value = SIMWARE.registers[index][logical_index] ;
		 }
		 br_value = br_value.padEnd(3,' ') ;

                 // display name
		 var obj = document.getElementById("name_RF" + index) ;
		 if (obj != null) {
		     obj.innerHTML = br_value ;
		 }
	    }
        }

        function wepsim_show_rf_names ( )
        {
            wepsim_refresh_rf_names(0) ;
        }


        /*
         *  init_x
         */

        function wepsim_init_rf ( )
        {
            // Registers
            var o1_rf = "" ;
            var o1_rn = "" ;
	    for (var index=0; index < simhw_sim_states().BR.length; index++)
            {
		 o1_rn = "R"  + index ;
		 o1_rn = o1_rn.padEnd(3,' ') ;

		 o1_rf += "<button type='button' class='btn py-0 px-1 mt-1 col-auto' " +
			  "        style='border-color:#cecece; background-color:#f5f5f5' data-role='none' " +
                          "        data-toggle='popover-up' data-popover-content='" + index + "' data-container='body' " +
                          "        id='rf" + index + "'>" +
                          "<span id='name_RF" + index + "' class='p-0 text-monospace' style='float:center; '>" + o1_rn + "</span>&nbsp;" +
                          "<span class='badge badge-secondary text-dark' style='background-color:#CEECF5; ' id='tbl_RF"  + index + "'>" +
			  "<div id='rf_" + index + "'><span data-bind='text: computed_value'>&nbsp;</span></div>" +
                          "</span>" +
                          "</button>" ;
	    }

            $("#states_BR").html("<div class='d-flex flex-row flex-wrap justify-content-around justify-content-sm-between'>" + o1_rf + "</div>");

            // Pop-overs
	    $("[data-toggle=popover-up]").popover({
	    	    html:      true,
                    placement: 'auto',
                    animation: false,
                    trigger:   'click',
		    template:  '<div class="popover shadow" role="tooltip">' +
                               '<div class="arrow"></div>' +
		               '<h3  class="popover-header"></h3>' +
		               '<div class="popover-body"></div>' +
		               '</div>',
		    container: 'body',
		    content: function() {
		        var index = $(this).attr("data-popover-content");
                        var hexvalue = get_value(simhw_sim_states().BR[index]);
                        return hex2values(hexvalue, index) ;
		    },
		    title: function() {
		        var index = $(this).attr("data-popover-content");
                        var id_button = "&quot;#rf" + index + "&quot;" ;
		        return '<span class="text-dark"><strong>R' + index + '</strong></span>' +
                               '<button type="button" id="close" class="close" ' +
                               '        onclick="$(' + id_button + ').click();">&times;</button>';
		    },
		    sanitizeFn: function (content) {
                        return content ; // DOMPurify.sanitize(content) ;
                    }
	    });

	    // knockout binding
	    for (var index=0; index < simhw_sim_states().BR.length; index++)
            {
		 var ref_obj = simhw_sim_states().BR[index] ;
		 if (typeof ref_obj.value != "function")
                 {
		     ref_obj.value          = ko_observable(ref_obj.value).extend({notify:'always'}) ;
		     ref_obj.computed_value = ko.computed(function() {
						   var rf_format = get_cfg('RF_display_format') ;
						   var rf_value  = this.value() >>> 0 ;
						   return value2string(rf_format, rf_value) ;
					      }, ref_obj) ;
                 }

		 ko_context = document.getElementById('rf_' + index) ;
		 ko.cleanNode(ko_context) ;
		 ko.applyBindings(ref_obj, ko_context) ;
	    }
        }

        function wepsim_init_states ( )
        {
            var sim_eltos = simhw_sim_states() ;
            var filter    = simhw_internalState('filter_states') ;

            // Fast UI configuration
            var o1 = "" ;

            // Registers
	    var divclass =  "" ;
	    var value    =  "" ;

            var part1 = "" ;
            var part2 = "" ;
            for (var i=0; i<filter.length; i++)
            {
                var    s = filter[i].split(",")[0] ;
                divclass = filter[i].split(",")[1] ;

                var showkey = sim_eltos[s].name;
                if (sim_eltos[s].nbits > 1)
	        {
                    part1 = showkey.substring(0, 3) ;
                    part2 = showkey.substring(3, showkey.length) ;

		    if (showkey.length < 3)
                         showkey = '<span class="text-monospace">' + part1 + '&nbsp;</span>' ;
		    else showkey = '<span class="text-monospace">' + part1 + '</span>' ;

		    if (part2.length > 0)
                        showkey += '<span class="d-none d-sm-inline-flex text-monospace">' + part2 + '</span>' ;
	        }

                o1 += "<button type='button' class='btn py-0 px-1 mt-1 " + divclass + "' " +
		      "        style='border-color:#cecece; background-color:#f5f5f5' data-role='none' " +
                      "        data-toggle='popover-bottom' data-popover-content='" + s + "' data-container='body' " +
                      "        id='rp" + s + "'>" +
                      showkey +
                      " <span class='badge badge-secondary text-dark' style='background-color:#CEECF5;' id='tbl_"  + s + "'>" +
		      "<div id='rf_" + s + "'><span data-bind='text: computed_value'>&nbsp;</span></div>" +
                      "</span>" +
                      "</button>" ;
            }

            $("#states_ALL").html("<div class='d-flex flex-row flex-wrap justify-content-around justify-content-sm-between'>" + o1 + "</div>");

            // Pop-overs
	    $("[data-toggle=popover-bottom]").popover({
	    	    html:      true,
                    placement: 'bottom',
                    animation: false,
		    content: function() {
		        var index = $(this).attr("data-popover-content");
                        var hexvalue = get_value(simhw_sim_states()[index]);
                        return hex2values(hexvalue, index) ;
		    },
		    title: function() {
		        var index = $(this).attr("data-popover-content");
                        var id_button = "&quot;#rp" + index + "&quot;" ;
		        return '<span class="text-dark"><strong>' + simhw_sim_states()[index].name + '</strong></span>' +
                               '<button type="button" id="close" class="close" ' +
                               '        onclick="$(' + id_button + ').click();">&times;</button>';
		    },
		    sanitizeFn: function (content) {
                        return content ; // DOMPurify.sanitize(content) ;
                    }
	    });

	    // knockout binding
            for (var i=0; i<filter.length; i++)
            {
                 var s = filter[i].split(",")[0] ;
		 var ref_obj = sim_eltos[s] ;
		 if (typeof ref_obj.value != "function")
                 {
		     ref_obj.value          = ko_observable(ref_obj.value).extend({notify:'always'}) ;
		     ref_obj.computed_value = ko.computed(function() {
						   var rf_format = get_cfg('RF_display_format') ;
						   var rf_value = value2string('text:char:nofill', this.value()) ;
						   if (this.nbits > 1) {
						       rf_value = value2string(rf_format, (this.value() >>> 0)) ;
						   }
						   return rf_value ;
					      }, ref_obj) ;
                 }

		 ko_context = document.getElementById('rf_' + s) ;
		 ko.cleanNode(ko_context) ;
		 ko.applyBindings(ref_obj, ko_context) ;
	    }
        }
