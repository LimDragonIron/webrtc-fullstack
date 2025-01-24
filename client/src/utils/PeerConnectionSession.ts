"use client"
import * as io from 'socket.io-client';

let RTCPeerConnection: typeof window.RTCPeerConnection;
let RTCSessionDescription: typeof window.RTCSessionDescription;

if (typeof window !== 'undefined') {
  RTCPeerConnection = window.RTCPeerConnection;
  RTCSessionDescription = window.RTCSessionDescription;
}

type StreamCallback = (stream: MediaStream) => void;
type UserCallback = (user: string) => void;
type UsersCallback = (users: string[], current: string) => void;
type SocketIdCallback = (socketId: string) => void;

interface CallMadeData {
  socket: string;
  offer: RTCSessionDescriptionInit;
}

interface AnswerMadeData {
  socket: string;
  answer: RTCSessionDescriptionInit;
}

interface AddUserData {
  user: string;
}

interface RemoveUserData {
  socketId: string;
}

interface UpdateUserListData {
  users: string[];
  current: string;
}

class PeerConnectionSession {
  private _onConnected?: () => void;
  private _onDisconnected?: () => void;
  private _room?: string;
  peerConnections: { [id: string]: RTCPeerConnection } = {};
  senders: RTCRtpSender[] = [];
  listeners: { [id: string]: (event: Event) => void } = {};

  constructor(private socket:io.Socket) {
    this.onCallMade();
  }

  addPeerConnection(id: string, stream: MediaStream, callback: StreamCallback): void {
    this.peerConnections[id] = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    stream.getTracks().forEach((track) => {
      this.senders.push(this.peerConnections[id].addTrack(track, stream));
    });

    this.listeners[id] = (event: Event) => {
        // @ts-ignore
        const fn = this['_on' + capitalizeFirstLetter(this.peerConnections[id].connectionState as string)];
        fn && fn(event, id);
    };

    this.peerConnections[id].addEventListener('connectionstatechange', this.listeners[id]);

    this.peerConnections[id].ontrack = ({ streams: [stream] }) => {
      console.log({ id, stream });
      callback(stream);
    };

    console.log(this.peerConnections);
  }

  removePeerConnection(id: string): void {
    this.peerConnections[id].removeEventListener('connectionstatechange', this.listeners[id]);
    delete this.peerConnections[id];
    delete this.listeners[id];
  }

  isAlreadyCalling = false;

  async callUser(to: string): Promise<void> {
    if (this.peerConnections[to].iceConnectionState === 'new') {
      const offer = await this.peerConnections[to].createOffer();
      await this.peerConnections[to].setLocalDescription(new RTCSessionDescription(offer));

      this.socket.emit('call-user', { offer, to });
    }
  }

  onConnected(callback: () => void): void {
    this._onConnected = callback;
  }

  onDisconnected(callback: () => void): void {
    this._onDisconnected = callback;
  }

  joinRoom(room: string): void {
    this._room = room;
    this.socket.emit('joinRoom', {room:room});
  }
  
  onCallMade(): void {
    console.log(this.socket)
    this.socket.on('call-made', async (data: CallMadeData) => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.peerConnections[data.socket].createAnswer();
      await this.peerConnections[data.socket].setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit('make-answer', {
        answer,
        to: data.socket,
      });
    });
  }

  onAddUser(callback: UserCallback): void {
    this.socket.on(`${this._room}-add-user`, async ({ user }: AddUserData) => {
      callback(user);
    });
  }

  onRemoveUser(callback: SocketIdCallback): void {
    this.socket.on(`${this._room}-remove-user`, ({ socketId }: RemoveUserData) => {
      callback(socketId);
    });
  }

  onUpdateUserList(callback: UsersCallback): void {
    this.socket.on(`${this._room}-update-user-list`, ({ users, current }: UpdateUserListData) => {
      callback(users, current);
    });
  }

  onAnswerMade(callback: SocketIdCallback): void {
    this.socket.on('answer-made', async (data: AnswerMadeData) => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.answer));
      callback(data.socket);
    });
  }

  clearConnections(): void {
    this.socket.close();
    this.senders = [];
    Object.keys(this.peerConnections).forEach(this.removePeerConnection.bind(this));
  }
}

export const createPeerConnectionContext = (token:string): PeerConnectionSession => {
    const socket = new (io.io as any)(
        `${process.env.NEXT_PUBLIC_BACK_SOCKET_URL}/socket/chat`,
        {
            transports : ['websocket'],
            extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    return new PeerConnectionSession(socket);
};

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}