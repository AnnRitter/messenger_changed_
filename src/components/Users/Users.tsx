import { useMemo } from 'react';
import { TUser, UserStatusConnetion } from "../../App";
import "./Users.scss"

// type User = {
//     id: string,
//     name: string,
//     status: string,
// }

export interface UserProps {
    users: TUser[],
}

export function getUserStatusText(user: TUser) {
    switch(user.status) {
        case UserStatusConnetion.Connected: return 'Online';
        case UserStatusConnetion.Disconected: return 'Offline';
        default: break;
    }
    return 'Unknown';
}

export interface IUserProps {
    user: TUser,
    onClick?: (user: TUser) => void
}

export function User({user, onClick}: IUserProps) {

    const statusText = useMemo(() => getUserStatusText(user), [user.status]);

    return (
        <div key={user.id}  className="user__wrap">
            <li onClick={() => onClick && onClick(user)}>{user.name}</li>
            <span className="user__status">{statusText}</span>
        </div>
    );
}

export interface IUsersProps {
    users: TUser[],
    onUserClick: IUserProps['onClick']
}

export function Users({
    users,
    onUserClick
}: IUsersProps) {

    /*
    useEffect(() => {
        async function fetchData() {
             let res = await connection
            setHub(res);

            // console.log(users);
            
         }
         fetchData()
     }, [connection])
    */
     
    return (
        <div className="users__wrap">
            <h1 className="users__title">Список пользователей</h1>  
            <ul>  
                {users ? users.map(
                    (user) => (
                        <User
                            key={user.id}
                            user={user}
                            onClick={onUserClick}
                        />
                    )
                ) : 'Нет активных пользователей'}
            </ul>
        </div>
    )
}
//