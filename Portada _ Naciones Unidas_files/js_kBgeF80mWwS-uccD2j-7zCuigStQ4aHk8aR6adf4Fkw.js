(function($){

var testMode = false;
var intMaxIterations = 100;
var liveNowElement = "div#block-un-home-11";

function runLiveNowTest() {

  var testData = {"nodes":[
    {"node":{"field_display_label":"Live Now","field_link":"url1","publish_on":"2016-02-12T16:15:00-05:00","unpublish_on":"2016-02-12T17:00:00-05:00","field_link_et":"News Title 1"}},
    {"node":{"field_display_label":"Live Now","field_link":"url2","publish_on":"2016-02-12T17:15:00-05:00","unpublish_on":"2016-02-12T18:00:00-05:00","field_link_et":"News Title 2"}},
    {"node":{"field_display_label":"Live Now","field_link":"url3","publish_on":"2016-02-12T18:15:00-05:00","unpublish_on":"2016-02-12T19:00:00-05:00","field_link_et":"News Title 3"}}
  ]};

  var localTime = new Date();
  console.log('Running test, local time is ' + localTime.toString());

  for (j=0;j<testData.nodes.length;j++) {
    var node = testData.nodes[j].node;
    console.log('Item ' + j + ': ' + node.field_link_et);
    console.log('- Start publishing on: '+ node.publish_on);
    console.log('- Stop publishing on: ' + node.unpublish_on);
    console.log('- Display: ' + ((displayNode(node, localTime))? 'Yes' : 'No' ));
    console.log( /*break*/ );
  }

}

function debugNode(node, clientTime) {
  console.log(node);
  console.log('Display Node ? ' + ((displayNode(node,clientTime))?'Yes':'No') );
  console.log('Display HTML = ' + getNodeHTML(node));
}

function displayNode(node, clientTime) {
  var startTime = Date.parse(node.publish_on);
  var stopTime = Date.parse(node.unpublish_on);
  return (((clientTime-startTime)>0 | isNaN(clientTime-startTime)) & (clientTime-stopTime)<0);
}

function getNodeHTML(node) {
  return '<span class="live-now">'
  + node.field_display_label
  + '</span>:&nbsp;<a href="'
  + node.field_link
  + '" target="0">'
  + node.field_link_et
  + '</a>';
}

function processNodes(arrayOfNodes, clientTime) {
  jQuery.each(arrayOfNodes, function(i, arrayItem) {
    if ( i === intMaxIterations ) {
      return false;
    }

    //debugNode(arrayItem.node);
    jQuery(liveNowElement).empty(); // Empty out block.
    if (displayNode(arrayItem.node, clientTime)) {
      jQuery(liveNowElement).html(getNodeHTML(arrayItem.node));
      return false;
    }
  });
}

function loadLiveNow(){
  var url = '/' + Drupal.settings.theme.language + '/live-now-feed.json?' + (new Date).getTime().toString().substr(0,9);
  jQuery.getJSON(url).done(function(data) {
    jQuery.ajaxSetup({ cache:false });
    processNodes(data.nodes, Date.now());      
  });
}

jQuery(document).ready(function(){
  if (testMode) {
    runLiveNowTest();
  } else if (jQuery('body.front')) {
    loadLiveNow();
    setInterval(loadLiveNow, 60000);
  }
});

})(jQuery);;
