/*
 * Copyright (c) 2012 Prima Sense Corp. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
// Author: Oliver Atoa

$(document).ready(function () {
  var bg = chrome.extension.getBackgroundPage();
  var time = bg.timer.lapse;
  var fileName = bg.file.name;
  var contentType = bg.file.contentType;
  var url = bg.file.url;
//  var reqDate = Date(Math.round( bg.timer.start ));
  var len = fileSizeFormat( bg.file.len );
  var cache = ( bg.file.fromCache ) ? "true" : "false" ;

//  var reqDate = dateFormat( bg.timer.start );

  $('#timer').html( "" + ( time ) ? time : "00:00" );


  // XXX locale
//  var reqDate = new Date;
//  var reqDate = Date( Math.round( bg.timer.start ) );
  //var dateString = "" + reqDate.getMonth() + "/" + reqDate.getDate() + "/" + reqDate.getFullYear() + " " + reqDate.getHours() + ":" + reqDate.getMinutes() + ":" reqDate.getSeconds() ;
//  var dateString = "" + reqDate.getMonth();
  


  $('#file-name').html(fileName);
  $('#content-type').html(contentType);
//  $('#url').replace('<a href="' + url + ">" + url.replace( /^(http(s)?:\/\/[^\/]*)/, "$1") + "</a>"  );
  //$('#date').html( dateShortFormat( Date(Math.round( bg.timer.start) ) ) );
  $('#date').html( Date(Math.round( bg.timer.start) ).toLocaleString() );
  $('#len').html(len);
  $('#cache').html(cache);

  /*
  // set interval
  var tid = setInterval( updateTimer() , 1000);
  function updateTimer() {

    // update details when timer stops
    if( bg.timer.runningStatus === "stop" ) {
      clearInterval(tid);
      // on / off toggle
      $('#on').button('toggle');
      $('#reset').button('reset');
    } else if (bg.timer.runningStatus === "running" ) {
      $('#reset').button('loading');
   
      $('#timer').append(".");
      $('#file-name').html(fileName);
      $('#content-type').html(contentType);
//      $('#url').append('<a href="' + url + ">" + url.replace( /^(http(s)?:\/\/[^\/]*)/, "$1") + "</a>"  );
      $('#date').append(date);
      $('#len').append(len);
      $('#cache').append(cache);
    }
  }
  */
});

function fileSizeFormat(fs) {
  if (fs >= 1073741824) { return (fs / 1073741824).toFixed(2) + " GB"; }
  if (fs >= 1048576)    { return (fs / 1048576).toFixed(2) + " MB"; }
  if (fs >= 1024)       { return Math.round(fs / 1024).toLocaleString() + " KB"; }
  return fs + " B";
}; 

// http://jsfiddle.net/nCE9u/4/
function dateShortFormat(d){
    // padding function
    var s = function(a,b){return(1e15+a+"").slice(-b)};

    // default date parameter
    if (typeof d === 'undefined'){
        d = new Date();
    };

    // return ISO datetime
    //return d.getFullYear() + '-' +
    return d.getYear() + '-' +
        s(d.getMonth()+1,2) + '-' +
        s(d.getDate(),2) + ' ' +
        s(d.getHours(),2) + ':' +
        s(d.getMinutes(),2) + ':' +
        s(d.getSeconds(),2);
}
