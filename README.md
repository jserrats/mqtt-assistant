# `mqtt-assistant`

This project tries to replace Home Assistant automations with real code. It maps Zigbee2MQTT & ESPHome actions and attributes to Typescript objects.

## Install

```sh
npm install https://github.com/jserrats/mqtt-assistant
```

## Usage examples

### Simple control

```ts
import { zigbee } from "mqtt-assistant"

var laundryLight = new zigbee.LightZigbee("light0")

laundryLight.on()
```

### Setting a simple automation

```ts
import { zigbee, router } from "mqtt-assistant"

var laundrySensor = new zigbee.PresenceSensorZigbee("zigbee2mqtt_name")
var laundryLight = new zigbee.LightZigbee("zigbee2mqtt_name")

router.addAutomation({ trigger: laundrySensor.trigger.occupied, callback: () => { laundryLight.on() } })
router.addAutomation({ trigger: laundrySensor.trigger.cleared, callback: () => { laundryLight.off() } })
```