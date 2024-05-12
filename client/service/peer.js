class PeerService {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });

    // Event listener for adding remote tracks to the peer connection
    this.peer.addEventListener("track", (event) => {
      if (this.onRemoteTrack) {
        this.onRemoteTrack(event);
      }
    });
  }

  async getAnswer(offer) {
    if (!this.peer) return;

    try {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error setting local description for answer:", error);
      throw error;
    }
  }

  async setLocalDescription(answer) {
    if (!this.peer) return;

    try {
      await this.peer.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error setting remote description for answer:", error);
      throw error;
    }
  }

  async getOffer() {
    if (!this.peer) return;

    try {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  addLocalStream(stream) {
    if (!this.peer) return;

    try {
      stream.getTracks().forEach((track) => {
        this.peer.addTrack(track, stream);
      });
    } catch (error) {
      console.error("Error adding local stream:", error);
    }
  }

  onRemoteTrack(event) {
    // Handle remote tracks, such as adding them to a remote video element
  }
}

export default new PeerService();
