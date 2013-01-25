var FirefoxOSTest = {
  init: function init() {
    var geolocation = document.getElementById('geolocation');
    geolocation.addEventListener('click', this.testGeolocation);
    var vibration = document.getElementById('vibration');
    vibration.addEventListener('click', this.testVibration);
    var notification = document.getElementById('notification');
    notification.addEventListener('click', this.testNotification);
    var systemxhr = document.getElementById('systemxhr');
    systemxhr.addEventListener('click', this.testSystemxhr);
    var webactivitywindow = document.getElementById('webactivitywindow');
    webactivitywindow.addEventListener('click', this.testWebactivityWindow);
    var webactivityinline = document.getElementById('webactivityinline');
    webactivityinline.addEventListener('click', this.testWebactivityInline);
    var devicestorage = document.getElementById('devicestorage');
    devicestorage.addEventListener('click', this.testDevicestorage);
    var contact = document.getElementById('contact');
    contact.addEventListener('click', this.testContact);
  },
  testGeolocation: function(e) {
    var ele = document.getElementById('result');
    ele.innerHTML = '';
    navigator.geolocation.getCurrentPosition(function(position) {
      ele.textContent = 'latitude ' + position.coords.latitude +
                        'longitude ' + position.coords.longitude;
    }, function() {
      alert('Error: cannot fetch location');
    }, {timeout: 3000}); 
  },

  testVibration: function(e) {
    window.navigator.vibrate([200, 100, 200]); 
  },

  testNotification: function(e) {
    var notification = navigator.mozNotification.createNotification('Title', 
      'hello world', 'style/icons/logo_128.png');
    notification.show();
  },

  testWebactivityWindow: function(e) {
    // test window activity
    var act = new MozActivity({
      name: 'browse',
      data: {
        type: 'photos'
      }
    });
    act.onerror = function(e) {
      if (act.error.name === 'NO_PROVIDER') {
        console.warn('Error: no activity provider');
      }
      else {
        console.warn('Error: unknown activity - ' + act.error.name);
      }
    };
  },

  testWebactivityInline: function(e) {
    var ele = document.getElementById('result');
    ele.innerHTML = '';
    var activityRequest = new MozActivity({
      name: 'pick',
      data: {
        type: 'image/jpeg',
        width: 320,
        height: 480
      }
    });
    activityRequest.onsuccess = function onPickSuccess() {
      if (!activityRequest.result.blob)
        return;
      ele.textContent = activityRequest.result.blob; 
    };
    activityRequest.onerror = function onPickError() {
      console.warn('pick failed!');
    };
  },

  testSystemxhr: function(e) {
    var ele = document.getElementById('result');
    ele.innerHTML = '';
    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.open('get', 'http://redirector.cloudfoundry.com/twitter.json', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        ele.textContent = xhr.responseText;
      }   
    };  
    xhr.send();
  },

  testDevicestorage: function(e) {
    var type = 'pictures';
    var deviceStorage = navigator.getDeviceStorage(type);
    if (!deviceStorage) {
      console.warn('Error: cannot get DeviceStorage for ' + type);
      return;
    }   
    var ele = document.getElementById('result');
    ele.innerHTML = '';
    var request = deviceStorage.enumerate();
    request.onsuccess = function(e) {
      var file = request.result;
      ele.innerHTML += 'file name: ' + file.name + '<br>';
      ele.innerHTML += 'file size: ' + file.size + '<br>';
      ele.innerHTML += 'file type: ' + file.type + '<br>';
      ele.innerHTML += 'file last Modified Date ' + file.lastModifiedDate + '<br><br>';
      request.continue();
    };
    request.onerror = function() {
      console.warn('Error: cannot list files in SD card - ' + request.error.name);
    };
  },

  testContact: function(e) {
    var ele = document.getElementById('result');
    ele.innerHTML = '';
    // add a contact
    var myContact = {
      'name': 'Alice Wang',
      'givenName': 'Alice',
      'familyName': 'Wang',
      'tel': [{'value': '0912345678'}]
    };
    var contact = new mozContact();
    contact.init(myContact);
    var request = navigator.mozContacts.save(contact);
    request.onerror = function onerror() {
      console.warn('Error: save contact - ' + request.error.name);
    };
    request.onsuccess = function onsuccess() {
      // read the first contact from contact list
      var options = {
        sortBy: 'familyName',
        sortOrder: 'ascending'
      };
      var request2 = navigator.mozContacts.find(options);
      request2.onsuccess = function findSuccess() {
        var firstContact = request2.result[0];
        ele.innerHTML += 'name' + firstContact.name + '<br>';
        ele.innerHTML += 'tel number' + firstContact.tel[0].value + '<br>';
        ele.innerHTML += 'update time' + new Date(firstContact.updated) + '<br>';
      };
      request2.onerror = function findError() {
        console.warn('Error: cannot find any contacts - ' + request2.error.name);
      };
    };
  }
};

FirefoxOSTest.init();
