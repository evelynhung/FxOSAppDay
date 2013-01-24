var FirefoxOSTest = {
  init: function init() {
    var geolocation = document.getElementById('geolocation');
    geolocation.addEventListener('click', this.testGeolocation);
    var vibration = document.getElementById('vibration');
    vibration.addEventListener('click', this.testVibration);
    var notification = document.getElementById('notification');
    notification.addEventListener('click', this.testNotification);
    var orientation = document.getElementById('orientation');
    orientation.addEventListener('click', this.testOrientation);
    var systemxhr = document.getElementById('systemxhr');
    systemxhr.addEventListener('click', this.testSystemxhr);
    var audiochannel = document.getElementById('audiochannel');
    audiochannel.addEventListener('click', this.testAudiochannel);
    var webactivity = document.getElementById('webactivity');
    webactivity.addEventListener('click', this.testWebactivity);
    var devicestorage = document.getElementById('devicestorage');
    devicestorage.addEventListener('click', this.testDevicestorage);
  },
  testGeolocation: function(e) {
    var target = e.target;
    navigator.geolocation.getCurrentPosition(function(position) {
      var ele = document.getElementById('result');
      ele.textContent = 'latitude ' + position.coords.latitude +
                        'longitude ' + position.coords.longitude;
    }, function() {
      alert('Error: cannot fetch location');
    }, {timeout: 3000}); 
  },
  testNotification: function(e) {
    var notification = navigator.mozNotification.createNotification('Title', 
      'hello world', 'style/icons/logo_128.png');
  },
  testDevicestorage: function(e) {
    var type = 'pictures';
    var deviceStorage = navigator.getDeviceStorage(type);
    if (!deviceStorage) {
      console.warn('Error: cannot get DeviceStorage for ' + type);
      return;
    }
    var filename = 'downloads/DSC02798.JPG';
    var request = deviceStorage.get(filename);
    request.onsuccess = function(e) {
      var file = request.result;
      var url = URL.createObjectURL(file);
      var myImage = document.getElementById('profilePhoto');
      myImage.src = url;                                                                                                                                                                     
    };
    request.onerror = function() {
      console.warn('Error: get file from SD card - ' + request.error.name);
    };
  }

};

FirefoxOSTest.init();
