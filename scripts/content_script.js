/*
 * Copyright (c) 2012 Prima Sense Corp. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
// Author: oliver.atoa@gmail.com

if( document.title.indeOf("HyperCRON") {
  var port = chrome.extension.connect({name: "cronPopup"});

  port.postMessage({"status": "start"});

} else {
  return;
}
