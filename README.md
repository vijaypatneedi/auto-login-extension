### chrome-extension-auto-login-example

chrome extension to autoLogin

#### Steps to use:

1. Download the extension and Unzip

![image](https://user-images.githubusercontent.com/46915849/216813837-6a873573-c9c2-49b7-8635-97f5bfb6d6f3.png)



2. Open chrome://extensions/ in your chrome browser

3. Check Developer mode checkbox

4. Click on Load Unpacked extension and give the local path of the extension in your system in step 1.

5. Extenion icon will appear. Click on that icon and set your username and password and save the settings.

Open the website where you want to autologin.

<img src="https://user-images.githubusercontent.com/46915849/173779099-f6ce6b99-05ef-413e-98fd-230e3aac401e.png" width="400">

CheckIn Logic: when connected to vpn automatically tries to login and save the checkIn time

CheckOut Logic: After 8 hours from checkIn, triggers checkOut every 15min, as the latest checked out time is always updated in VMS.


Features to be implemented :

- on click of any button or updating inputs, the reset button should be updated to submit

- If the url is https://vms.axisb.com:8443/login then it has to updated to https://vms.axisb.com:8443/

Things to try:

- Staffit

- Timesheet
