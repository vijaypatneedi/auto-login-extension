### chrome-extension-auto-login-example

chrome extension to autoLogin

#### Steps to use:

1. Download the extension and Unzip

![image](https://user-images.githubusercontent.com/46915849/189331776-b23a808c-8ba9-4030-baca-ac0bcfb9939b.png)



2. Open chrome://extensions/ in your chrome browser

3. Check Developer mode checkbox

4. Click on Load Unpacked extension and give the local path of the extension in your system in step 1.

5. Extenion icon will appear. Click on that icon and set your username and password and save the settings.

Open the website where you want to autologin.

![image](https://user-images.githubusercontent.com/46915849/216814068-ea805066-e550-40a5-a8e7-78dc92d66b41.png)

CheckIn Logic: when connected to vpn automatically tries to login and save the checkIn time

CheckOut Logic: After 8 hours from checkIn, triggers checkOut every 15min, as the latest checked out time is always updated in VMS.


Features to be implemented :

- on click of any button or updating inputs, the reset button should be updated to submit

- If the url is https://vms.axisb.com:8443/login then it has to updated to https://vms.axisb.com:8443/

Things to try:

- Staffit

- Timesheet
