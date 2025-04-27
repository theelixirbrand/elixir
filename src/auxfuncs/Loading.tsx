import {CompDataContext} from '../App.tsx';
import {useContext} from 'react';

const Loading = () => {
    const backref = useContext(CompDataContext)['backref'];
    const percent = useContext(CompDataContext)['percent'];

    return (
        <div>

            <div ref={backref} style={{ height: '100vh', width: '100vw', position: 'fixed', top: '0', left: '0', opacity:'0', zIndex : '-1', transition : 'opacity 0.5s ease' }} className="">
                <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: '100vh' }} className="CenterVertically">


                    <div className="CenterHorizontally">
                        <h1 style={{ color: 'white', textAlign: 'center' }}>
                            Loading
                        </h1>

                        <div style={{ position: 'relative' }} className="CenterHorizontally">
                            <div style={{ height: '3vw', width: '80vw', background: 'linear-gradient(to left, black, white)', marginTop: '2vh', borderRadius: '100vw' }}>
                            </div>
                            <div style={{ height: '2.65vw', transition: 'width 0.1s ease-in-out',  width: (0.795 * percent) + 'vw', marginLeft:'0.25vw', background: 'linear-gradient(45deg, black, white)', marginTop: '2vh', borderRadius: '100vw', position: 'absolute', top: '0.15vw' }}>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Loading