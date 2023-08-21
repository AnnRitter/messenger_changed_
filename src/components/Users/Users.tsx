
import { useMemo } from 'react';
import { TUser, UserStatusConnetion } from "../../App";

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
        <div key={user.id}  className="flex-horizontal space-between">
            <li onClick={() => onClick && onClick(user)}>{user.name}</li>
            <span className="status">{statusText}</span>
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
        <div className="wrap max">
            <h1 className="center">Список пользователей</h1>  
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