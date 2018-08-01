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


        /*
         *  Get/Set
         */

        function get_simware ( )
        {
            var curr_firm = simhw_internalState('FIRMWARE') ;

	    if (typeof curr_firm['firmware'] == "undefined")
            {
                curr_firm['firmware']           = new Array() ;
                curr_firm['mp']                 = new Object() ;
                curr_firm['seg']                = new Object() ;
                curr_firm['assembly']           = new Object() ;
                curr_firm['labels']             = new Object() ;
                curr_firm['labels2']            = new Object() ;
                curr_firm['labels_firm']        = new Object() ;
                curr_firm['registers']          = new Object() ;
                curr_firm['cihash']             = new Object() ;
                curr_firm['pseudoInstructions'] = new Object() ;
		curr_firm['stackRegister']      = new Object() ;
            }

            return curr_firm ;
	}

        function set_simware ( preSIMWARE )
        {
            var curr_firm = simhw_internalState('FIRMWARE') ;

	    if (typeof preSIMWARE['firmware'] != "undefined")
                curr_firm['firmware'] = preSIMWARE['firmware'] ;
	    if (typeof preSIMWARE['mp'] != "undefined")
                curr_firm['mp'] = preSIMWARE['mp'] ;
	    if (typeof preSIMWARE['registers'] != "undefined")
                curr_firm['registers'] = preSIMWARE['registers'] ;
	    if (typeof preSIMWARE['cihash'] != "undefined")
                curr_firm['cihash'] = preSIMWARE['cihash'] ;
	    if (typeof preSIMWARE['assembly'] != "undefined")
                curr_firm['assembly'] = preSIMWARE['assembly'] ;
	    if (typeof preSIMWARE['pseudoInstructions'] != "undefined")
                curr_firm['pseudoInstructions'] = preSIMWARE['pseudoInstructions'] ;

	    if (typeof preSIMWARE['seg'] != "undefined")
                curr_firm['seg'] = preSIMWARE['seg'] ;
	    if (typeof preSIMWARE['labels'] != "undefined")
                curr_firm['labels'] = preSIMWARE['labels'] ;
	    if (typeof preSIMWARE['labels2'] != "undefined")
                curr_firm['labels2'] = preSIMWARE['labels2'] ;
	    if (typeof preSIMWARE['labels_firm'] != "undefined")
                curr_firm['labels_firm'] = preSIMWARE['labels_firm'] ;
	    if (typeof preSIMWARE['stackRegister'] != "undefined")
		curr_firm['stackRegister'] = preSIMWARE['stackRegister'] ;
	}


        /*
         *  checking & updating
         */

        var tri_state_names = [ "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11" ] ;

        var databus_fire_visible = false ;
        var internalbus_fire_visible = false ;

        function check_buses ( fired )
        {
            // TD + R
            if (databus_fire_visible) {
                //$("#databus_fire").hide();
		     var o = document.getElementById('svg_p');
		     if (o != null) o = o.contentDocument;
		     if (o != null) o = o.getElementById('databus_fire');
		     if (o != null) o.setAttributeNS(null, "visibility", "hidden");
                databus_fire_visible = false ;
            }
            if ( (simhw_sim_signal("TD").value != 0) && (simhw_sim_signal("R").value != 0) )
            {
                //$("#databus_fire").show();
		     var o = document.getElementById('svg_p');
		     if (o != null) o = o.contentDocument;
		     if (o != null) o = o.getElementById('databus_fire');
		     if (o != null) o.setAttributeNS(null, "visibility", "visible");
                databus_fire_visible = true ;
                simhw_sim_state("BUS_DB").value = 0xFFFFFFFF;
            }

            // Ti + Tj
            if (tri_state_names.indexOf(fired) == -1)
                return;

            // 1.- counting the number of active tri-states
            var tri_name = "";
            var tri_activated = 0;
	    var tri_activated_name  = "";
	    var tri_activated_value = 0;
            for (var i=0; i<tri_state_names.length; i++)
            {
		 tri_activated_name  = tri_state_names[i] ;
                 tri_activated_value = parseInt(get_value(simhw_sim_signal(tri_activated_name))) ;
                 tri_activated      += tri_activated_value ;

		 if (tri_activated_value > 0)
		     tri_name = tri_activated_name ;
                 if (tri_activated > 1)
                     break ;
            }

            // 2.- paint the bus if any tri-state is active
            if (tri_activated > 0) {
                update_draw(simhw_sim_signal(tri_name), 1) ;
            }

            // 3.- check if more than one tri-state is active
            if (internalbus_fire_visible) {
                //$("#internalbus_fire").hide();
		     var o = document.getElementById('svg_p');
		     if (o != null) o = o.contentDocument;
		     if (o != null) o = o.getElementById('internalbus_fire');
		     if (o != null) o.setAttributeNS(null, "visibility", "hidden");
                internalbus_fire_visible = false ;
            }
            if (tri_activated > 1) {
                //$("#internalbus_fire").show();
		     var o = document.getElementById('svg_p');
		     if (o != null) o = o.contentDocument;
		     if (o != null) o = o.getElementById('internalbus_fire');
		     if (o != null) o.setAttributeNS(null, "visibility", "visible");
                internalbus_fire_visible = true ;
                simhw_sim_state("BUS_IB").value = 0xFFFFFFFF;
            }
        }

        function check_behavior ( )
        {
            // 1.- check if no signals are defined...
            if (0 == simhw_sim_signals().length)
                alert("ALERT: empty signals!!!");

            // 2.- check if no states are defined...
            if (0 == simhw_sim_states().length)
                alert("ALERT: empty states!!!");

            for (var key in simhw_sim_signals())
            {
                for (var key2 in simhw_sim_signal(key).behavior)
                {
		    // 1.- Split several behaviors, example: "MV D1 O1; MV D2 O2"
                    var behaviors = simhw_sim_signal(key).behavior[key2].split(";") ;

		    // 2.- For every behavior...
		    for (var i=0; i<behaviors.length; i++)
                    {
			    var behavior_i = behaviors[i].trim();
			    var behavior_k = behavior_i.split(" ") ;

			    if ("" == behavior_i)  {
                                continue;
			    }

			    if (typeof (simhw_syntax_behavior(behavior_k[0])) == "undefined")
			    {
				alert("ALERT: Unknown operation -> " + behavior_k[0] + " (" + behavior_i + ")");
				return;
			    }

			    if (behavior_k.length != simhw_syntax_behavior(behavior_k[0]).nparameters)
			    {
				alert("ALERT: Behavior has an incorrect number of elements --> " + behavior_i + "/" + simhw_syntax_behavior(behavior_k[0]).nparameters);
				return;
			    }

			    for (var j=1; j<behavior_k.length; j++)
			    {
				var s = behavior_k[j].split('/') ;
				var t = simhw_syntax_behavior(behavior_k[0]).types[j-1] ;

				     if ( ("E" == t) && (typeof simhw_sim_state(s[0]) == "undefined") )
				     {
					  alert("ALERT: Behavior has an undefined reference to a object state -> '" + behavior_i);
					  return;
				     }
				else if ( ("S" == t) && (typeof simhw_sim_signal(s[0]) == "undefined") )
				     {
					 alert("ALERT: Behavior has an undefined reference to a signal -> '" + behavior_i);
					 return;
				     }
				else if ( ("X" == t) && (typeof simhw_sim_state(s[0]) == "undefined") && (typeof simhw_sim_signal(s[0]) == "undefined") )
				     {
					 alert("ALERT: Behavior has an undefined reference to a object state OR signal -> '" + behavior_i);
					 return;
				     }
			    }
                    }
                }
            }
        }


        /*
         *  work with behaviors
         */

        var jit_behaviors   = false ;
        var jit_fire_dep    = null ;
        var jit_fire_order  = null ;
	var jit_dep_network = null ;
        var jit_fire_ndep   = null ;

        function firedep_to_fireorder ( jit_fire_dep )
        {
            var allfireto = false;
            jit_fire_order = new Array();
            jit_fire_ndep  = new Array();
            for (var sig in simhw_sim_signals())
            {
                if (typeof jit_fire_dep[sig] == "undefined") {
                    jit_fire_order.push(sig);
                    continue;
                }

		ndep = 0;
                allfireto = false;
                for (var sigorg in jit_fire_dep[sig])
                {
	             ndep++;
                     if (jit_fire_dep[sig][sigorg] == simhw_sim_signal(sigorg).behavior.length) {
                         allfireto = true;
                     }
                }
		jit_fire_ndep[sig] = ndep;
                if (allfireto == false)
                    jit_fire_order.push(sig);
            }
        }

        function compile_behaviors ()
        {
            var jit_bes = "";
            jit_fire_dep = new Object();

            for (var sig in simhw_sim_signals())
            {
		 jit_bes += "simhw_sim_signal('" + sig + "').behavior_fn = new Array();\n" ;

                 for (var val in simhw_sim_signal(sig).behavior)
                 {
                      var input_behavior = simhw_sim_signal(sig).behavior[val] ;
                      var jit_be = "";

		      // 1.- Split several behaviors, e.g.: "MV D1 O1; MV D2 O2"
		      var s_exprs = input_behavior.split(";");

		      // 2.- For every behavior...
		      for (var i=0; i<s_exprs.length; i++)
		      {
			    // 2.1.- ...to remove white spaces from both sides, e.g.: "  MV D1 O1  " (skip empty expression, i.e. "")
			    s_exprs[i] = s_exprs[i].trim() ;
			    if ("" == s_exprs[i]) continue ;

			    // 2.2.- ...to split into expression, e.g.: "MV D1 O1"
			    var s_expr = s_exprs[i].split(" ");

			    // 2.3a.- ...to do the operation
                            if (s_expr[0] != "NOP") // warning: optimizated just because nop.operation is empty right now...
			        jit_be += "simhw_syntax_behavior('" + s_expr[0] + "').operation(" + JSON.stringify(s_expr) + ");\t" ;

                            // 2.3b.- ...build the fire graph
                            if ( ("FIRE" == s_expr[0]) &&
                                 (simhw_sim_signal(sig).type == simhw_sim_signal(s_expr[1]).type) )
                            {
                                if (typeof jit_fire_dep[s_expr[1]] == "undefined")
                                    jit_fire_dep[s_expr[1]] = new Object();

                                if (typeof jit_fire_dep[s_expr[1]][sig] == "undefined")
                                    jit_fire_dep[s_expr[1]][sig] = 0;

                                jit_fire_dep[s_expr[1]][sig]++;
                            }
		      }

		      jit_bes += "simhw_sim_signal('" + sig + "').behavior_fn[" + val + "] = \t function() {" + jit_be + "};\n" ;
                 }
            }

	    eval(jit_bes) ;
            jit_behaviors = true ;
        }

        function compute_behavior (input_behavior)
        {
            // 1.- Split several behaviors, e.g.: "MV D1 O1; MV D2 O2"
            var s_exprs = input_behavior.split(";");

            // 2.- For every behavior...
            for (var i=0; i<s_exprs.length; i++)
            {
                    // 2.1.- ...to remove white spaces from both sides, e.g.: "  MV D1 O1  " (skip empty expression, i.e. "")
		    s_exprs[i] = s_exprs[i].trim() ;
                    if ("" == s_exprs[i]) continue ;

                    // 2.2.- ...to split into expression, e.g.: "MV D1 O1"
		    var s_expr = s_exprs[i].split(" ");

                    // 2.3.- ...to do the operation
		    simhw_syntax_behavior(s_expr[0]).operation(s_expr);
            }
        }

        function compute_general_behavior ( name )
        {
            if (jit_behaviors)
                 simhw_syntax_behavior(name).operation();
            else compute_behavior(name) ;
        }

        function compute_signal_behavior ( signal_name, signal_value )
        {
            if (jit_behaviors)
                 simhw_sim_signal(signal_name).behavior_fn[signal_value]();
            else compute_behavior(simhw_sim_signal(signal_name).behavior[signal_value]) ;
        }


        /*
	 * CLOCK (parallel / sequential)
	 */

        function fn_updateE_now ( key )
        {
	    if ("E" == simhw_sim_signal(key).type) {
		update_state(key) ;
	    }
	}

        function fn_updateE_future ( key ) 
        {
            if (jit_fire_ndep[key] < 1) // 1 -> 2
	        fn_updateE_now(key); 
	    else
	        return new Promise( function(resolve, reject) { fn_updateE_now(key); }) ;
	}

        function fn_updateL_now ( key )
        {
	    update_draw(simhw_sim_signal(key), simhw_sim_signal(key).value) ;
	    if ("L" == simhw_sim_signal(key).type) {
		update_state(key) ;
	    }
	}

        function fn_updateL_future ( key ) 
        {
            if (jit_fire_ndep[key] < 1) // 1 -> 2
	        fn_updateL_now(key); 
	    else
	        return new Promise( function(resolve, reject) { fn_updateL_now(key); });
	}


        /*
         *  Show/Update the global state
         */

        function update_state ( key )
        {
           var index_behavior = 0;

           switch (simhw_sim_signal(key).behavior.length)
           {
                case 0: // skip empty behavior
                     return;
                     break;

                case 1: // several signal values share the same behavior -> behavior[0]
                     index_behavior = 0;
                     break;

                default:
                     index_behavior = simhw_sim_signal(key).value ;
                     if (simhw_sim_signal(key).behavior.length < index_behavior) {
                         alert('ALERT: there are more signals values than behaviors defined!!!!\n' +
                               'key: ' + key + ' and signal value: ' + index_behavior);
                         return;
                     }
                     break;
           }

           compute_signal_behavior(key,index_behavior) ;
        }


        function show_memories_values ( )
        {
		/*
               show_main_memory(simhw_internalState('MP'),               
                                get_value(simhw_sim_state('REG_PC')),        true, true) ;
            show_control_memory(simhw_internalState('MC'),
                                simhw_internalState('MC_dashboard'), 
                                get_value(simhw_sim_state('REG_MICROADDR')), true, true) ;
		*/

            var f1 = new Promise(function(resolve, reject) {
                 show_main_memory(simhw_internalState('MP'), 
                                  get_value(simhw_sim_state('REG_PC')), true, true) ;
                 resolve(1);
            });
            var f2 = new Promise(function(resolve, reject) {
                 show_control_memory(simhw_internalState('MC'), 
                                     simhw_internalState('MC_dashboard'), 
                                     get_value(simhw_sim_state('REG_MICROADDR')), true) ;
                 resolve(1);
            });

            Promise.all([f1, f2]);
	}

        function update_signal_firmware ( key )
        {
            var SIMWARE = get_simware() ;

	    var assoc_i = -1;
            for (var i=0; i<SIMWARE['firmware'].length; i++) {
		 if (parseInt(SIMWARE['firmware'][i]["mc-start"]) > get_value(simhw_sim_state("REG_MICROADDR"))) { break; }
		 assoc_i = i ;
            }

            if (-1 == assoc_i)
            {
	        alert("A new 'unknown' instruction is inserted,\n" +
                      "please edit it (co, nwords, etc.) in the firmware textarea.") ;

                var new_ins = new Object() ;
                new_ins["name"]            = "unknown" ;
                new_ins["signature"]       = "unknown" ;
                new_ins["signatureGlobal"] = "unknown" ;
                new_ins["co"]              = 0 ;
                new_ins["nwords"]          = 0 ;
                new_ins["mc-start"]        = 0 ;
                new_ins["fields"]          = new Array() ;
                new_ins["microcode"]       = new Array() ;
                new_ins["microcomments"]   = new Array() ;

                SIMWARE['firmware'].push(new_ins) ;
                assoc_i = SIMWARE['firmware'].length - 1 ;
            }

	    var pos = get_value(simhw_sim_state("REG_MICROADDR")) - parseInt(SIMWARE['firmware'][assoc_i]["mc-start"]) ;
	    if (typeof SIMWARE['firmware'][assoc_i]["microcode"][pos] == "undefined") {
		SIMWARE['firmware'][assoc_i]["microcode"][pos]     = new Object() ;
		SIMWARE['firmware'][assoc_i]["microcomments"][pos] = "" ;
	    }
	    SIMWARE['firmware'][assoc_i]["microcode"][pos][key] = simhw_sim_signal(key).value ;

            if (simhw_sim_signal(key).default_value == simhw_sim_signal(key).value)
	        delete SIMWARE['firmware'][assoc_i]["microcode"][pos][key] ;

	    // show memories...
	    var bits = get_value(simhw_sim_state('REG_IR')).toString(2) ;
	    bits = "00000000000000000000000000000000".substring(0, 32 - bits.length) + bits ;
	    //var op_code = parseInt(bits.substr(0, 6), 2) ; // op-code of 6 bits

            show_memories_values() ;
	}

        function update_signal_loadhelp ( helpdiv, key )
        {
	     var help_base = 'help/signals-' + get_cfg('ws_idiom') + '.html #' + key;
	     $(helpdiv).load(help_base,
			      function(response, status, xhr) {
				  if ( $(helpdiv).html() == "" )
				       $(helpdiv).html('<br>Sorry, No more details available for this signal.<p>\n');
				  $(helpdiv).trigger('create');
			      });
             ga('send', 'event', 'help', 'help.signal', 'help.signal.' + key);
	}

        function update_signal (event)
        {
	    if (false === get_cfg('is_interactive'))
                return;

            for (var key in simhw_sim_signals())
            {
                for (var j=0; j<simhw_sim_signal(key).fire_name.length; j++)
                {
	            var r = simhw_sim_signal(key).fire_name[j].split(':') ;
                    if (r[1] == event.currentTarget.id)
                    {
                        var checkvalue  = (simhw_sim_signal(key).value >>> 0) ;
                        var str_bolded  = "";
                        var str_checked = "";
                        var input_help  = "";
                        var behav_str   = new Array();
                        var n = 0;

                        var nvalues = Math.pow(2, simhw_sim_signal(key).nbits) ;
                        if (simhw_sim_signal(key).behavior.length == nvalues)
                        {
                            for (var k = 0; k < simhw_sim_signal(key).behavior.length; k++)
                            {
                                 if (k == checkvalue)
                                      str_checked = ' checked="checked" ' ;
                                 else str_checked = ' ' ;

                                 behav_str = simhw_sim_signal(key).behavior[k].split(";") ;
                                 if (simhw_sim_signal(key).default_value != k)
                                      str_bolded =         behav_str[0] ;
                                 else str_bolded = '<b>' + behav_str[0] + '</b>' ;

                                 n = simhw_sim_signal(key).behavior[k].indexOf(";");
                                 if (-1 == n)
                                     n = simhw_sim_signal(key).behavior[k].length;
                                 str_bolded = '&nbsp;' + str_bolded +
                                              '<span style="color:#CCCCCC">' + simhw_sim_signal(key).behavior[k].substring(n) + '</span>' ;

                                 n = k.toString(10) ;
				 input_help += '<li><label>' +
                                               '<input aria-label="value ' + n + '" type="radio" name="ask_svalue" ' +
                                               '       value="' + n + '" ' + str_checked + ' />' + str_bolded +
                                               '</label></li>' ;
                            }
                        }
                        else {
				 input_help += '<div><center><label>' +
                                               '<input aria-label="value for ' + key + '" type="number" size=4 min=0 max=' + (nvalues - 1) + ' class=dial ' +
                                               '       name="ask_svalue" value="' + simhw_sim_signal(key).value + '"/>' + '&nbsp;&nbsp;' + ' 0 - ' + (nvalues - 1) +
                                               '</center></label></div>\n' ;
                        }



			var bb = bootbox.dialog({
			       title:   '<center>' + key + ': ' +
                                        ' <div class="btn-group">' +
                                        '   <button onclick="$(\'#bot_signal\').carousel(0);" ' +
                                        '           type="button" class="btn btn-info">Value</button>' +
                                        '   <button onclick="$(\'#bot_signal\').carousel(1); update_signal_loadhelp(\'#help2\',$(\'#ask_skey\').val());" ' +
                                        '           type="button" class="btn btn-success">Help</button>' +
                                        '   <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" ' +
                                        '           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                        '     <span class="caret"></span>' +
                                        '     <span class="sr-only">Toggle Help Idiom</span>' +
                                        '   </button>' +
                                        '   <div class="dropdown-menu">' +
                                        '        <a href="#" class="dropdown-item" ' + 
				        '                    onclick="set_cfg(\'ws_idiom\',\'es\'); save_cfg(); $(\'#bot_signal\').carousel(1); ' +
                                        '                             update_signal_loadhelp(\'#help2\',$(\'#ask_skey\').val());" ' + 
				        '        >ES<span class="d-none d-sm-inline-flex">&nbsp;(Spanish)</span></a>' +
                                        '        <a href="#" class="dropdown-item" ' + 
				        '                    onclick="set_cfg(\'ws_idiom\',\'en\'); save_cfg(); $(\'#bot_signal\').carousel(1); ' +
                                        '                             update_signal_loadhelp(\'#help2\',$(\'#ask_skey\').val());" ' +
				        '        >EN<span class="d-none d-sm-inline-flex">&nbsp;(English)</span></a>' +
                                        '   </div>' +
                                        ' </div>' +
                                        '</center>',
                               message: '<div id="bot_signal" class="carousel slide" data-ride="carousel" data-interval="false">' +
                                        '  <div class="carousel-inner" role="listbox">' +
                                        '    <div class="carousel-item active">' +
                                        '         <div style="max-height:70vh; width:inherit; overflow:auto; -webkit-overflow-scrolling:touch;">' +
                                        '         <form class="form-horizontal" style="white-space:nowrap;">' +
                                        '         <input aria-label="value for ' + key + '" id="ask_skey" name="ask_skey" type="hidden" value="' + key + '" class="form-control input-md"> ' +
                                        '         <ol start="0">' +
                                                  input_help +
                                        '         </ol>' +
                                        '         </form>' +
                                        '         </div>' +
                                        '    </div>' +
                                        '    <div class="carousel-item">' +
                                        '         <div id=help2 style="max-height:70vh; width:inherit; overflow:auto; -webkit-overflow-scrolling:touch;">Loading...</div>' +
                                        '    </div>' +
                                        '  </div>' +
                                        '</div>',
			       value:   simhw_sim_signal(key).value,
                               animate: false,
                               size:    'large',
			       buttons: {
					    success: {
						label: "Save",
						className: "btn-primary col-xs-3 col-sm-2 float-right",
						callback: function ()
							  {
							     key        = $('#ask_skey').val();
							     user_input = $("input[name='ask_svalue']:checked").val();
                                                             if (typeof user_input == "undefined")
							         user_input = $("input[name='ask_svalue']").val();

							     simhw_sim_signal(key).value = user_input ;

	                                                     if (true === get_cfg('is_interactive'))
							     {
								 // update REG_MICROINS
                                                                 if (simhw_sim_signal(key).value != simhw_sim_signal(key).default_value)
								      simhw_sim_state("REG_MICROINS").value[key] = simhw_sim_signal(key).value ;
								 else delete(simhw_sim_state("REG_MICROINS").value[key]);

								 // update MC[uADDR]
								 var curr_maddr = get_value(simhw_sim_state("REG_MICROADDR")) ;
								 if (typeof simhw_internalState_get('MC', curr_maddr) == "undefined") {
								     simhw_internalState_set('MC', curr_maddr, new Object()) ;
								     simhw_internalState_set('MC_dashboard', curr_maddr, new Object()) ;
								 }
                                                                 simhw_internalState_get('MC', curr_maddr)[key] = simhw_sim_signal(key).value ;
								 simhw_internalState_get('MC_dashboard', curr_maddr)[key] = { comment: "", breakpoint: false, state: false, notify: new Array() };

								 // update ROM[..]
								 update_signal_firmware(key) ;

								 // update save-as...
								 var SIMWARE = get_simware() ;
								 document.getElementById("inputFirmware").value = saveFirmware(SIMWARE) ;
							     }
							
							     // fire signal
							     compute_behavior('FIRE ' + key) ;
							  }
					    },
					    close: {
						label: "Close",
						className: "btn-danger col-xs-3 col-sm-2 float-right",
						callback: function() { }
					    }
					}
			});

			bb.find(".modal-title").addClass("mx-auto") ;

                        $(".dial").knob({ 'min':0, 'max':(nvalues-1) })
                                  .val(simhw_sim_signal(key).value)
                                  .trigger('change');

                    } // if (event.name == signals.firename.name)
                } // for all signals.firename...
            } // for all signals

	    show_states();
	    show_rf_values();
        }

        // update ALU flags: test_n, test_z, test_v, test_c
        function update_nzvc ( flag_n, flag_z, flag_v, flag_c )
        {
	   set_value(simhw_sim_state("FLAG_N"), flag_n) ;
	   set_value(simhw_sim_state("FLAG_Z"), flag_z) ;
	   set_value(simhw_sim_state("FLAG_V"), flag_v) ;
	   set_value(simhw_sim_state("FLAG_C"), flag_c) ;

	   set_value(simhw_sim_signal("TEST_N"), flag_n) ;
	   set_value(simhw_sim_signal("TEST_Z"), flag_z) ;
	   set_value(simhw_sim_signal("TEST_V"), flag_v) ;
	   set_value(simhw_sim_signal("TEST_C"), flag_c) ;
        }

        function update_memories ( preSIMWARE )
        {
	    // 1.- load the SIMWARE
            set_simware(preSIMWARE) ;
            var SIMWARE = get_simware() ;

	    // 2.- load the MC from ROM['firmware']
            simhw_internalState_reset('MC') ;
            simhw_internalState_reset('MC_dashboard') ;
            for (var i=0; i<SIMWARE['firmware'].length; i++)
	    {
               var elto_state  = false ;
               var elto_break  = false ;
               var elto_notify = new Array() ;

	       var last = SIMWARE['firmware'][i]["microcode"].length ; // mc = microcode
               var mci  = SIMWARE['firmware'][i]["mc-start"] ;
	       for (var j=0; j<last; j++)
	       {
		    var comment  = SIMWARE['firmware'][i]["microcomments"][j] ;
                    elto_state   = (comment.trim().split("state:").length > 1) ;
                    elto_break   = (comment.trim().split("break:").length > 1) ;
                    elto_notify  =  comment.trim().split("notify:") ;
		    for (var k=0; k<elto_notify.length; k++) {
		         elto_notify[k] = elto_notify[k].split('\n')[0] ;
                    }

		    simhw_internalState_set('MC',           mci, SIMWARE['firmware'][i]["microcode"][j]) ;
                    simhw_internalState_set('MC_dashboard', mci, { comment: comment, 
                                                                   state: elto_state, 
                                                                   breakpoint: elto_break, 
                                                                   notify: elto_notify }) ;
		    mci++;
	       }
	    }

	    // 3.- load the ROM (2/2)
            simhw_internalState_reset('ROM') ;
            for (var i=0; i<SIMWARE['firmware'].length; i++)
	    {
               if ("begin" == SIMWARE['firmware'][i]['name']) {
                   continue ;
               }

	       var ma = SIMWARE['firmware'][i]["mc-start"] ;
	       var co = parseInt(SIMWARE['firmware'][i]["co"], 2) ;
               var cop = 0 ;
	       if (typeof SIMWARE['firmware'][i]["cop"] != "undefined")
	           cop = parseInt(SIMWARE['firmware'][i]["cop"], 2) ;

               var rom_addr = 64*co + cop ;
	       simhw_internalState_set('ROM', rom_addr, ma) ;
               SIMWARE['cihash'][rom_addr] = SIMWARE['firmware'][i]['signature'] ;
	    }

	    // 4.- load the MP from SIMWARE['mp']
            simhw_internalState_reset('MP') ;
	    for (var key in SIMWARE['mp'])
	    {
	       var kx = parseInt(key)
	       var kv = parseInt(SIMWARE['mp'][key].replace(/ /g,''), 2) ;
               simhw_internalState_set('MP', kx, kv) ;
	    }

            /// bugfix safari bug 10.1.2
            /*
	    for (var e in MP) {
	         if (isNaN(MP[e])) {
	    	     delete MP[e];
                 }
            }
            */
            /// end bugfix 

	    // 5.- load the segments from SIMWARE['seg']
            simhw_internalState_reset('segments') ;
	    for (var key in SIMWARE['seg'])
	    {
	         simhw_internalState_set('segments', key, SIMWARE['seg'][key]) ;
	    }

	    // 6.- show memories...
            show_main_memory   (simhw_internalState('MP'), 0, true, true) ;
            show_control_memory(simhw_internalState('MC'), simhw_internalState('MC_dashboard'), 0, true) ;
	}

