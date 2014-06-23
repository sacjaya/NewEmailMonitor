$(document).ready(function() {
	// variable to hold request
	var request;
	//bind to the submit event of our form
	$("#emailMonitorConfigForm").submit(function(event){
		// abort any pending request
		 if (request) {
		     request.abort();
		 }
		 // setup some local variables
		 var $form = $(this);
		 // let's select and cache all the fields
		 var $inputs = $form.find("input, select, button, textarea");
		 // serialize the data in the form
		 var serializedData = $form.serialize();
		
		 // let's disable the inputs for the duration of the ajax request
		 // Note: we disable elements AFTER the form data has been serialized.
		 // Disabled form elements will not be serialized.
		 $inputs.prop("disabled", true);
		
		 // fire off the request to /api
		 request = $.ajax({
		     url: "config",
		     type: "post",
		     data: serializedData
		 });
		
		 // callback handler that will be called on success
		 request.done(function (response, textStatus, jqXHR){
		     // log a message to the console
			 bootbox.alert(response);
//		     console.log("Hooray, it worked!");
		 });
		
		 // callback handler that will be called on failure
		 request.fail(function (jqXHR, textStatus, errorThrown){
		     // log the error to the console
		     console.error(
		         "The following error occured: "+
		         textStatus, errorThrown
		     );
		     bootbox.alert("Please check values provided for input parameters!");
		 });
		
		 // callback handler that will be called regardless
		 // if the request failed or succeeded
		 request.always(function () {
		     // reenable the inputs
		     $inputs.prop("disabled", false);
		 });
		
		 // prevent default posting of form
		 event.preventDefault();
	});
	
	$("#emailMonitorQueryForm").submit(function(event){
		// abort any pending request
		 if (request) {
		     request.abort();
		 }
		 // setup some local variables
		 var $form = $(this);
		 // let's select and cache all the fields
		 var $inputs = $form.find("input, select, button, textarea");
		 // serialize the data in the form
		 var serializedData = $form.serialize();
		
		 // let's disable the inputs for the duration of the ajax request
		 // Note: we disable elements AFTER the form data has been serialized.
		 // Disabled form elements will not be serialized.
		 $inputs.prop("disabled", true);
		
		 // fire off the request to /api
		 request = $.ajax({
		     url: "query",
		     type: "post",
		     data: serializedData
		 });
		
		 // callback handler that will be called on success
		 request.done(function (response, textStatus, jqXHR){
		     // log a message to the console
			 $('#cepQueries').val('');
			 var jsonresponse = JSON.parse(response);
			 var checkString = $('#storedQueries tbody tr:first-child td p:first-child').text();
			 if (checkString === "There are no queries deployed to query the email account"){
				 $('#storedQueries tbody tr:first-child').remove();
			 }
			 
			 var linkString = '<a href = "..//carbon/eventprocessor/execution_plan_details.jsp?ordinal=1&execPlan=' + jsonresponse.planNames[0] + '"><span>' + jsonresponse.planNames[0] + '</span></a>';
			 
			 for (var i = 1; i < jsonresponse.planNames.length; i++){
				 linkString = linkString + ',<a href = "..//carbon/eventprocessor/execution_plan_details.jsp?ordinal=1&execPlan=' + jsonresponse.planNames[i] + '"><span>' + jsonresponse.planNames[i] + '</span></a>';
			 }
			 
			 $('#storedQueries tbody').append('<tr>'+
						'<td class="text-left row">'+
						'<div class="queryPlans col-md-offset-1 col-md-10 row">'+
						'<p class="text-left" id="queryName">Query : '+ jsonresponse.query +'</p>'+
						'<p class="text-left">Execution Plans : <span id="executionPlans">'+ linkString +'</span></p>'+
						'<p class="text-right col-md-11"><button type="button" class="btn btn-danger">Delete Query</button></p>'+
						'</div>'+
						'</td>'+
						'</tr>');
			 bootbox.alert(jsonresponse.message);
			 
//		     console.log("Hooray, it worked!");
		 });
		
		 // callback handler that will be called on failure
		 request.fail(function (jqXHR, textStatus, errorThrown){
		     // log the error to the console
		     console.error(
		         "The following error occured: "+
		         textStatus, errorThrown
		     );
		     bootbox.alert("Please check query for correct sysntax and check whether email monitor is configured with correct details!");
		 });
		
		 // callback handler that will be called regardless
		 // if the request failed or succeeded
		 request.always(function () {
		     // reenable the inputs
		     $inputs.prop("disabled", false);
		 });
		
		 // prevent default posting of form
		 event.preventDefault();
	});
	
	$( "#deleteConfig" ).click(function() {
		bootbox.confirm("Are you sure you want to delete email monitor configurations?", function(result) {
			if (result){			  
				request = $.ajax({
				     url: "config",
				     type: "delete",
				     data: ""
				 });
				
				 // callback handler that will be called on success
				 request.done(function (response, textStatus, jqXHR){
				     // log a message to the console
					 bootbox.alert(response);
		//		     console.log("Hooray, it worked!");
				 });
				
				 // callback handler that will be called on failure
				 request.fail(function (jqXHR, textStatus, errorThrown){
				     // log the error to the console
				     console.error(
				         "The following error occured: "+
				         textStatus, errorThrown
				     );
				     bootbox.alert("Please check email monitoring system configured properly!");
				 });
			 }
		});
	});
	
	$('#storedQueries tbody').on('click', 'button', function() {
		var row = $(this).parent().parent().parent().parent();
		var executionPlans = row.find( "#executionPlans a span");
		var query = row.find( "#queryName").text();
		var planNames = $(executionPlans[0]).text();
		for (var i = 1; i < executionPlans.length; i++){
			planNames = planNames + ',' + $(executionPlans[i]).text();
		 }
		
		bootbox.confirm("Are you sure you want to delete " + query + "?", function(result) {
			if (result){			  
				var input = $("<input>").attr("type", "hidden").attr("name", "planNames").val(planNames);
			    var form = $("<form>");
			    form.append($(input));
			    var serializedData = form.serialize();
			    
			    request = $.ajax({
				     url: "removeQuery",
				     type: "post",
				     data: serializedData
				 });
				
				 // callback handler that will be called on success
				 request.done(function (response, textStatus, jqXHR){
				     // log a message to the console
					 row.remove();
					 var checkrow = $('#storedQueries tbody tr:first-child').text();
					 if (checkrow == "" || checkrow === 'null' || checkrow == null || checkrow.length <= 0){
						 $('#storedQueries tbody').append('<tr>'+
									'<td class="text-left">'+
										'<p class="text-center">There are no queries deployed to query the email account</p>'+
							        '</td>'+
									'</tr>');
					 }
					 bootbox.alert(response + "<br>" + query);
		//		     console.log("Hooray, it worked!");
				 });
				
				 // callback handler that will be called on failure
				 request.fail(function (jqXHR, textStatus, errorThrown){
				     // log the error to the console
				     console.error(
				         "The following error occured: "+
				         textStatus, errorThrown
				     );
				     bootbox.alert("Please check values provided for input parameters!");
				 });
			 }
		});
	});
});