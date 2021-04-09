In MobaXterm launch a new SSH session. <br /> <br />
&nbsp;&nbsp;Remote Host: ec2-3-15-164-109.us-east-2.compute.amazonaws.com <br />
&nbsp;&nbsp;Username: ec2-user <br />
&nbsp;&nbsp;Advanced SSH Settings <br />
&nbsp;&nbsp;Use private key: BadgerBytesKeyPair.pem <br />
&nbsp;&nbsp;&nbsp;&nbsp;Private Key pair can be distributed to TAs upon request <br />
&nbsp;&nbsp;&nbsp;&nbsp;We are using the same ec2 instance and key pair as we did for the spike exercise <br />
&nbsp;&nbsp;&nbsp;&nbsp;Private key is stored on all of our machines <br /> <br />
New session will be launched <br />
&nbsp;&nbsp;$ mongo <br />
&nbsp;&nbsp;$ use gyf_backend_db <br />
&nbsp;&nbsp;$ db.games.find().pretty() <br />
You will now be able to see the games that have been created in our aws server
