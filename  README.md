#IoT Pints
----------------

Here we go punta Dreamin'

This example uses Node and J5 to connect and monitor beer flow, and Salesforce to track the current liters of beer into a barrel.

The Arduino code used in this example reads data from its sensors every 2 seconds. It reads the metter flow and sends those readings to Salesforce using Salesforce Platform Events. 


Salesforce stores the incoming data and opens a Case using IoT Explorer Orchestration and we send an email if the barrel is full again using an apex trigger.

## Step 1: What You Need

### General

- Your Arduino UNO.
- Flow metter sensor, connector pins, buttons, 
- A computer or raspberry pi to run Node JS.

## Step 2: Hardware Setup


## Salesforce IoT Explorer

The data received from the device may be processed, stored, and analyzed within Salesforce. This example demonstrates just a few of the many capabilities of Salesforce, which can be modified or extended as you explore further.

In this example, you create the following Salesforce entities:

- **Custom Object**  Stores the data received from the device so that the historical data can be monitored, for example using the Salesforce1 mobile app.
- **Platform Event**  Transfers the data from the device to Salesforce. A **Platform Event Trigger** inserts the received data into the Custom Object.
- **IoT Explorer Context** Lets you set up IoT Explorer Orchestration.
- **Custom Case Field** Opens customized **Cases**: a standard **Case** object with an additional field, the device ID.
- **IoT Explorer Orchestration** Defines a beer barrel state machine that reacts to incoming Platform Events and opens Cases as required.
- **Custom Object Tab**  Lets you make the Custom Object (with the stored data from the device) accessible from the Salesforce1 mobile app.

The Platform Event acts as an interface between the imp application and Salesforce. The Platform Event fields must have the names and types used in this example . If you change anything in the Platform Event definition, you will need to update the imp application’s agent source code. The name of the Platform Event is set in the agent code by the constant *READING_EVENT_NAME*.

In this project, we explore a specific example, but this is just one scenario you can use. As you continue to explore using Arduino with Salesforce, you can try out different scenarios with new fields, rules, sets of entities, and more.

## Run the APP

`npm start`

