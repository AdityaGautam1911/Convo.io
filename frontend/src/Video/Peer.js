class PeerService {
  constructor() {
    if (!this.peer) {
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
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      console.log("Received offer:", offer); // Log received offer
      if (!offer || !offer.type || !offer.sdp) {
        console.error("Invalid offer object:", offer);
        return;
      }
      try {
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(ans);
        return ans;
      } catch (error) {
        console.error(
          "Error setting remote description or creating answer:",
          error
        );
      }
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      console.log("Received answer:", ans);
      try {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      console.log("Generated offer:", offer); // Add this line to log the offer

      return offer;
    }
  }
}

export default new PeerService();

// class PeerService {
//   constructor() {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });
//     }
//   }

//   async getAnswer(offer) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(offer);
//       const ans = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(ans));
//       return ans;
//     }
//   }

//   async setLocalDescription(ans) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
//     }
//   }

//   async getOffer() {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//       return offer;
//     }
//   }
// }

// export default new PeerService();
