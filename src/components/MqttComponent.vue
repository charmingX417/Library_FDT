<template>
  <div>
    <h1>MQTT Demo</h1>
    <button @click="connect">连接 MQTT</button>
    <button @click="subscribe">订阅主题</button>
    <button @click="publish">发布消息</button>
    <button @click="disconnect">断开连接</button>
    <p>接收到的消息：{{ message }}</p>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import { connectMQTT, subscribeTopic, publishMessage, disconnectMQTT } from '../utils/mqtt';

export default {
  setup() {
    const message = ref('');
    let client = null;

    const connect = () => {
      client = connectMQTT('Your-ProductKey', 'Your-DeviceName', 'Your-DeviceSecret');
      if (client) {
        client.on('message', (topic, msg) => {
          message.value = msg.toString();
        });
      }
    };

    const subscribe = () => {
      subscribeTopic('/Your/ProductKey/YourDeviceName/subscribe/topic');
    };

    const publish = () => {
      publishMessage('/Your/ProductKey/YourDeviceName/publish/topic', '测试消息');
    };

    const disconnect = () => {
      disconnectMQTT();
    };

    onUnmounted(() => {
      disconnectMQTT();
    });

    return {
      connect,
      subscribe,
      publish,
      disconnect,
      message,
    };
  },
};
</script>
