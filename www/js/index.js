/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        init(); 

        console.log("- Device reaadt");
        var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal
        .startInit("bb8bcd07-9dfd-48b7-a742-e8a01cfeeefd")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


function init()
{
    console.log("- Function init");
    let sendNot = $(".sendNoti");
    sendNot.click(function()
    {
        console.log("- Clik on send");
        send();
    });

}


function send()
{
    console.log("- Init send");
    window.plugins.OneSignal.getIds(function(ids) {
        
        var notificationObj = { contents: {en: "message body"},
        include_player_ids: [ids.userId]};
        window.plugins.OneSignal.postNotification(notificationObj,
        
        function(successResponse) 
        {
          console.log("Notification Post Success:", successResponse);
        },
        
        function (failedResponse)
        {
          console.log("Notification Post Failed: ", failedResponse);
          alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
        }
      );
  });
}


