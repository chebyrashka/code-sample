/* exported initSearchResults, search_results, clearSearchResults, fillSearchResults, cardOwner, cardLender */

var xhr_search;
var xhr_search_mls;

var num_people;
var num_lenders;
var num_locations;
var num_campaigns;
var num_agents;
var num_offices;


function initSearchResults()
{
	//when clicking on the different sections of the search results page
	$('#screen-search-results > nav > section').click(function()
	{
		$('#screen-search-results > nav > section').removeClass('active');
		$(this).addClass('active');
	});
}


/**
 * route handler for unstructured query search
 * @param {string} query
 */
function searchResults(query)
{
	//do nothing if the query is basically empty
	if(!query || !query.length || !query.trim().length)
		return;
	
	//make sure the list is cleared before we show it
	clearSearchResults();
	
	//set page state to searching
	$('#screen-search-results').addClass('searching searching-mls');
	
	//put the query itself on the page
	$('#screen-search-results .search-query').text(query || '');
		
	showPage('search-results');
	
	
	hideAutocomplete();
	
	
	//terminate existing searches, if applicable
	abortRequest(xhr_search);
	abortRequest(xhr_search_mls);
	
	
	//invoke the search
	xhr_search = api['search']
		.read({ 'q': query })
		.done(fillSearchResults)
		.fail(failSearchResults);
		
	xhr_search_mls = api['search']
		.read('mls', { 'q': query })
		.done(fillSearchResultsMLS);
		//TODO: handle failure condition
}


/**
 * TODO
 */
function clearSearchResults()
{
	$('#screen-search-results').removeClass('no-results error');
	
	$('#screen-search-results .search-query').text(undefined);
	$('#screen-search-results ul.results').empty();
	
	//empty all the counts
	$('#screen-search-results')
		.find('.num-people, .num-locations, .num-lenders, .num-campaigns, .num-agents, .num-offices')
		.text(undefined);
}


/**
 * TODO
 * @param {Object} results
 */
function fillSearchResults(results)
{
	$('#screen-search-results').removeClass('searching');

	//if there's no data returned at all, show no results
	if(!data)
		return searchNoResults();

	
	//update counts only if they are present (do not overwrite anything)
	
	//extract counts
	num_people = results['people'] ? results['people'].length : 0;
	num_lenders = results['lenders'] ? results['lenders'].length : 0;
	num_locations = results['locations'] ? results['locations'].length : 0;
	num_campaigns = results['campaigns'] ? results['campaigns'].length : 0;
	num_agents = results['agents'] ? results['agents'].length : 0;
	num_offices = results['offices'] ? results['offices'].length : 0;

	
	//TODO: total number of records could also come from a header?
	var total = num_people + num_lenders + num_locations + num_campaigns + num_agents + num_offices;
	
	if(total === 0)
		return searchNoResults();
	
	
	//set total match count
	$('#screen-search-results > nav > header .num-results').text(total + ' matches found');

	//set counts
	$('#screen-search-results .num-people').text(num_people);
	$('#screen-search-results .num-locations').text(num_locations);
	$('#screen-search-results .num-lenders').text(num_lenders);
	$('#screen-search-results .num-campaigns').text(num_campaigns);
	$('#screen-search-results .num-agents').text(num_agents);
	$('#screen-search-results .num-offices').text(num_offices);
	
	
	//fill all result partials
	var lis = '';
	var $results = $('#screen-search-results .results');
	
	for(var i = 0; i < num_people; i++)		lis += htmlResultPerson(results['people'][i]);
	for(var i = 0; i < num_locations; i++)	lis += htmlResultLocation(results['locations'][i]);
	for(var i = 0; i < num_lenders; i++)	lis += htmlResultLender(results['lenders'][i]);
	for(var i = 0; i < num_campaigns; i++)	lis += htmlResultCampaign(results['campaigns'][i]);
	for(var i = 0; i < num_agents; i++)		lis += htmlResultAgent(results['agents'][i]);
	for(var i = 0; i < num_offices; i++)	lis += htmlResultOffice(results['offices'][i]);

	
	//sort results alphabetically before inserting
	$(lis)
		.sort(sortResultsByName)
		.appendTo($results);
}


/**
 * TODO
 * @param {Object} results
 */
function fillSearchResultsMLS(results)
{
	$('#screen-search-results').removeClass('searching');
}


/**
 * TODO
 */
function sortResultsByName(a, b)
{
	var a_upper = $('h3', a).text().toUpperCase();
	var b_upper = $('h3', b).text().toUpperCase();

	return a_upper.localeCompare(b_upper);
}


/**
 * TODO
 */
function failSearchResults()
{
	$('#screen-search-results').removeClass('searching');
	
	//TODO
	console.error('unable to load search results');
	
	$('#screen-search-results').addClass('error');
}


/**
 * TODO
 */
function searchNoResults()
{
	$('#screen-search-results').addClass('no-results');
	$('#screen-search-results > nav > header .num-results').text('No matches found');
}