import { useEffect, useState } from 'react';  
import { Chat } from './components/Chat/Chat';
import { Users } from './components/Users/Users';
import { HubConnectionBuilder, LogLevel, HttpTransportType, HubConnection } from "@microsoft/signalr";
// import classNames from 'classnames';
import "./App.css"

export enum UserStatusConnetion {
  Disconected,
  Connected
}

export type TUser = {
  id: string,
  name: string,
  status: UserStatusConnetion
}

const initConnection = async (
  setUsers: React.Dispatch<React.SetStateAction<TUser[]>>,
) => {
    const token = 'DEV';

    //const token = 'nh1nF2RLVakVSDQcVeGmOeU5vcMKOKN2ODzO737oKrT0vfsxlPMzWg2l4LSh';

    // if (!sessionStorage.getItem("key")) {
    //   sessionStorage.setItem("key", crypto.randomUUID());
    // }

    const userId = crypto.randomUUID();
    sessionStorage.setItem("key", userId);
    // const userId = sessionStorage.getItem("key");

    const hubConnection = new HubConnectionBuilder()
       .withUrl(`https://vac.astrapage.ru/hubs/chat/?user_id=${userId}`, {
        logger: LogLevel.Trace,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  // hubConnection.onclose(e => {
  //   setConnection()
  // });

  hubConnection.on('Connected', (data: {id: string}) => {
    setUsers((c: TUser[]) => {
      const newUsers = [...c];
      newUsers.push({
        id: data.id,
        name: 'User',
        status: UserStatusConnetion.Connected
      });
      return newUsers;
    });
  });

  hubConnection.on('Disconnected', (data: {id: string}) => {
    console.log('Disconnected', data);
    setUsers((c: TUser[]) => {
      const newUsers = [...c];
        const userRef = newUsers.find(x => x.id === data.id);
        if(userRef) {
          userRef.status = UserStatusConnetion.Disconected;
        }
      return newUsers;
    });
  });

  await hubConnection.start();

  /*
  setTimeout(() => {

    const id = '9c24bdf6-cd44-4883-aecc-66d83456144c';
    hubConnection.invoke('SendMessage', {
      to: id,
      text: 'Hi how are you',
    });
  });
  */

  return hubConnection;
}

function App() {

  const [connection, setConnection] = useState<HubConnection>();
  const [selectedUser, setSelectedUser] = useState<TUser | undefined>();
  const [users, setUsers] = useState<TUser[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const hubConnection = await initConnection(setUsers);

        setConnection(hubConnection);

        //setUsers(response);
        //dispatch(usersActions.addUsers(response));
    
        const clients = await hubConnection.invoke<{id: string}[]>('getClients');
       
        let currentId = sessionStorage.getItem("key");
        
        const normalizeClients = clients.map((x): TUser => {
            return {
              id: x.id,
              name:  currentId === x.id ? `User ${x.id.substring(0, 4)} (current)` : `User ${x.id.substring(0, 4)}`,
              // name: `User ${x.id.substring(0, 4)}`,
              status: UserStatusConnetion.Connected,
            }
        });

        setUsers(normalizeClients);
      }
      catch(ex) {
        console.error(ex);
      }
    }
    
    fetchData();

    return () => {
      connection?.stop();
    }
    
  }, []);
  
  return (
    <div className="app__wrap">
      <Users
        users={users}
        onUserClick={setSelectedUser}
      />
      {selectedUser &&
      <Chat
        connection={connection}
        selectedUser={selectedUser}
      />}
    </div>
  )
}

export default App
