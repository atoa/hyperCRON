/*
 * Copyright (c) 2012 Prima Sense Corp. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
// Author: Oliver Atoa

// put in order of most likely
var contentTypes = [
  /^application\/pdf/,
  /^application\/octet-stream/,
  /^application\/(vnd\.)?ms/
];

//var timeStart = new Date();
//var timeStop = new Date();
//
// XXX turn these vars into an object with constructor and accesors

var timer = {
  id: null,
  start: null,
  stop: null,
  lapse: "0",
  runningStatus: "stop"
};

var file = {
  id: null,
  name: null,
  contenType: null,
  url: null,
  len: null,
  fromCache: false
};

//var timers = [];

function process_onHeadersReceived(details) {
  if ( checkContentType( details.responseHeaders ) ) {
    console.time("ms");
//    timer.start = new Date().getTime();
    timer.start = details.timeStamp;
//        console.info("INFO -  timer.start: " + timer.start );
    timer.id = details.requestId;
    timer.runningStatus = "running";
  }
}

function checkContentType(headers) {
  var ret=false;
  headers.forEach( function ( header ) { 
    if ( !ret && /^[cC]ontent-[tT]ype/.test( header.name ) ) {
      console.info("INFO - content-type: " + header.value );

      contentTypes.forEach( function( type ) {
        if( type.test(header.value) ) {
          ret = true;
          file.contentType = header.value;
          return;
        }
      });
    }
  });
  return ret;
}
function process_requestHeaders(headers) {
  var name;
  headers.forEach( function ( header ) { 
    name = header.name.toLowerCase();
    switch ( name ) {
      case "content-type":
        console.info("INFO - content-type: " + header.value );
	file.contentType = header.value;
	break;
      case "content-disposition":
        console.info("INFO - name: " + header.value );
	file.name = header.value.replace(/^.*filename *= */, '');
	break;
      case "content-length":
        console.info("INFO - length: " + header.value );
	file.len = header.value;
	break;
    }
  });
}

function process_onCompleted(details) {
  if( timer.runningStatus !== "running" ||
      ! checkContentType(details.responseHeaders) ){
    return;
  }

  process_requestHeaders(details.responseHeaders);

  if(details.fromCache){
    file.fromCache = true;
    console.info("INFO - completed from cache: " + details.fromCache);
  }
  if(details.url){
    file.url = details.url;
    console.info("INFO - url: " + details.url);
  }
  if(details.requestId){
    file.id = details.requestId;
    console.info("INFO - requestId: " + details.requestId);
    console.info("INFO - timerId: " + timer.id);
  }

  console.timeEnd("ms");
//  timer.stop = new Date().getTime();
  timer.stop = details.timeStamp;
  timer.runningStatus = "stop";

  var timeDiff = Math.round(timer.stop - timer.start);

  //var timeDiff = new Date( Math.round(timer.stop - timer.start) );
//  console.info( "INFO - process_Completed: " + (timer.stop - timer.start) );
  setLapse( timeDiff );
}

var requestFilter = {
	/*
  urls: [ "https://gmail.com/*",
    "https://*.gmail.com/*",
  ]
  */
  urls: ["<all_urls>"],
  types: ["main_frame", "sub_frame", "script"]
}

chrome.webRequest.onHeadersReceived.addListener(process_onHeadersReceived,
  requestFilter,
  [ "blocking", "responseHeaders" ]
);

chrome.webRequest.onCompleted.addListener(process_onCompleted,
  requestFilter,
  [ "responseHeaders" ]
);

//XXX
/*
chrome.extension.onConnect.addListener(function(port) {
  var tab = port.sender.tab;
  switch (port.name) {
    case 'cronConn':
      break;
    default:
      consonle.log("ERROR - unsupported port name");
  } 
});
*/

chrome.browserAction.onClicked.addListener( function( tab ){
  chrome.browserAction.setBadgeText( { text: "" } );

    chrome.windows.create(
      {url: chrome.extension.getURL("/pages/popup.html"),
      type: "panel",
      width: 800,
      height: 860 }
    );
});

function getLapse( ) {
  return timer.lapse;
}

function setLapse( timeDiff ) {
  // badgeText can only be 4 chars wide
  if( timeDiff < 100 ) {
    timer.lapse = "" + timeDiff + "ms"; 
  } else if( timeDiff < 1000 ) {
    timer.lapse = "." + Math.round(timeDiff / 10) + "s"; 
//  } else if( timeDiff < 60000 ) {
//    badgeTextTime = "" + Math.round(timeDiff.getSeconds()) + "s"; 
  } else { // if( timeDiff < 60 * 60 * 1000 ) {
    timeDiff/=1000;
    var min = Math.round( (((timeDiff % 31536000) % 86400) % 3600) / 60 );
    var sec = Math.round( ((( timeDiff % 31536000) % 86400) % 3600) % 60 );
    if ( sec.toString().length < 2 ) { sec = ":0" + sec; }
    if ( min.toString().length < 2 ) { min = "0" + min; }
    timer.lapse = min + sec;
  }
}
