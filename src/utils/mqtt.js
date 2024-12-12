import mqtt from 'mqtt';

let client = null; // 将 client 定义为模块级别的变量

const mqttHostUrl = 'iot-06z00fnzwzns6a9.mqtt.iothub.aliyuncs.com';
const mqttUrl = `wss://${mqttHostUrl}:443`; // 使用 WebSocket 协议

const mqttOptions = {
    clientId: 'k0sicNTchIC.Bob1|securemode=2,signmethod=hmacsha256,timestamp=1733920944669|',
    username: 'Bob1&k0sicNTchIC',
    password: 'e66ff9ec14df92d978116271ba7f8eee81b26e16887ac0ff31d0ab3b8708faa2',
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
};

// 连接函数
export const connectMQTT = () => {
    client = mqtt.connect(mqttUrl, mqttOptions);

    client.on('connect', () => {
        console.log('MQTT Connected');
    });

    client.on('error', (error) => {
        console.error('MQTT Connection Error:', error);
    });

    client.on('close', () => {
        console.log('MQTT Connection Closed');
    });

    return client;
};

// 订阅主题函数
export const subscribeTopic = (topic, callback) => {
    if (client) {
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Failed to subscribe: ${err.message}`);
            } else {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });

        client.on('message', (msgTopic, message) => {
            if (msgTopic === topic && callback) {
                callback(message.toString());
            }
        });
    } else {
        console.error('MQTT client is not defined or connected');
    }
};
