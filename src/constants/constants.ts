export const decideNeighbours = (state : string) => {
    let foward
    let backward
    switch (state) {
        case 'RED.INTIAL':
            foward = 'redLight.finalState'
            backward = 'yellowLight'
            break;
        case 'RED.FINAL':
            foward = 'greenLight'
            backward = 'redLight.intialState'
            break;
        case 'GREEN':
            foward = 'yellowLight'
            backward = 'redLight.finalState'
            break;
        case 'YELLOW':
            foward = 'redLight.intialState'
            backward = 'greenLight'
            break;
        default:
            foward = 'redLight.finalState'
            backward ='yellowLight'
            break;
    }
    return [foward, backward]
}