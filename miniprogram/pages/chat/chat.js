const { request } = require('../../utils/api');

function createMessage(role, text) {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    thinking: false,
  };
}

Page({
  data: {
    draft: '',
    sending: false,
    messages: [
      createMessage(
        'coach',
        'Star，我来啦。今天想先玩一小局，还是先看看哪儿卡住了？你说一句，我跟上。'
      ),
    ],
    lastMessageId: '',
  },

  onLoad(options) {
    if (options.prompt) {
      this.setData({ draft: decodeURIComponent(options.prompt) });
    }
  },

  onInput(event) {
    this.setData({ draft: event.detail.value });
  },

  async sendMessage() {
    const text = this.data.draft.trim();
    if (!text || this.data.sending) return;

    const childMessage = createMessage('child', text);
    const thinkingMessage = {
      ...createMessage('coach', '盒饭正在想...'),
      thinking: true,
    };
    const messages = [...this.data.messages, childMessage, thinkingMessage];
    this.setData({
      messages,
      draft: '',
      sending: true,
      lastMessageId: thinkingMessage.id,
    });

    try {
      const result = await request('/api/chat', {
        method: 'POST',
        data: { message: text },
        role: 'child',
      });
      const coachMessage = {
        ...thinkingMessage,
        text: result.answer,
        thinking: false,
      };
      this.setData({
        messages: this.data.messages.map((message) =>
          message.id === thinkingMessage.id ? coachMessage : message
        ),
        lastMessageId: coachMessage.id,
      });
    } catch (error) {
      const errorMessage = {
        ...thinkingMessage,
        text: error.message,
        thinking: false,
      };
      this.setData({
        messages: this.data.messages.map((message) =>
          message.id === thinkingMessage.id ? errorMessage : message
        ),
        lastMessageId: errorMessage.id,
      });
    } finally {
      this.setData({ sending: false });
    }
  },
});
