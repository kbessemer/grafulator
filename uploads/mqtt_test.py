import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("info/#")

# The callback for when a PUBLISH message is received from the MQTT server.
def on_message(client, userdata, msg):
    macid = msg.topic.split("/")
    macid = macid[2]
    
    if macid == 'b8:27:eb:3d:79:1f':
        print(msg.topic+" "+str(msg.payload))


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("mqtt-data.machinesense.com", 8883, 60)
client.loop_forever()