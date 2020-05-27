import { DATA, SCENE, LAYOUT } from "../templates/plotParams"

const _drawHexapod = hexapod => {
    const polygonPoints = hexapod.body.closedPointsList
    const bodyX = polygonPoints.map(point => point.x)
    const bodyY = polygonPoints.map(point => point.y)
    const bodyZ = polygonPoints.map(point => point.z)
    const { head, cog } = hexapod.body
    const { cogProjection, legs, groundContactPoints } = hexapod

    const dBodyMesh = {
        ...DATA[0],
        x: bodyX,
        y: bodyY,
        z: bodyZ,
    }

    const dBodyOutline = {
        ...DATA[1],
        x: bodyX,
        y: bodyY,
        z: bodyZ,
    }

    const dHead = {
        ...DATA[2],
        x: [head.x],
        y: [head.y],
        z: [head.z],
    }

    const dCog = {
        ...DATA[3],
        x: [cog.x],
        y: [cog.y],
        z: [cog.z],
    }

    const dCogProjection = {
        ...DATA[4],
        x: [cogProjection.x],
        y: [cogProjection.y],
        z: [cogProjection.z],
    }

    const dLegs = legs.map((leg, index) => ({
        ...DATA[index + 5],
        x: leg.allPointsList.map(point => point.x),
        y: leg.allPointsList.map(point => point.y),
        z: leg.allPointsList.map(point => point.z),
    }))

    const dSupportPolygon = {
        ...DATA[11],
        x: groundContactPoints.map(point => point.x),
        y: groundContactPoints.map(point => point.y),
        z: groundContactPoints.map(point => point.z),
    }

    const axisScale = hexapod.body.dimensions.front / 2

    const hXaxis = {
        ...DATA[12],
        x: [cog.x, cog.x + axisScale * hexapod.localFrame.xAxis.x],
        y: [cog.y, cog.y + axisScale * hexapod.localFrame.xAxis.y],
        z: [cog.z, cog.z + axisScale * hexapod.localFrame.xAxis.z],
    }

    const hYaxis = {
        ...DATA[13],
        x: [cog.x, cog.x + axisScale * hexapod.localFrame.yAxis.x],
        y: [cog.y, cog.y + axisScale * hexapod.localFrame.yAxis.y],
        z: [cog.z, cog.z + axisScale * hexapod.localFrame.yAxis.z],
    }

    const hZaxis = {
        ...DATA[14],
        x: [cog.x, cog.x + axisScale * hexapod.localFrame.zAxis.x],
        y: [cog.y, cog.y + axisScale * hexapod.localFrame.zAxis.y],
        z: [cog.z, cog.z + axisScale * hexapod.localFrame.zAxis.z],
    }

    const wXaxis = {
        ...DATA[15],
        x: [0, axisScale],
    }

    const wYaxis = {
        ...DATA[16],
        y: [0, axisScale],
    }

    const wZaxis = {
        ...DATA[17],
        z: [0, axisScale],
    }

    return [
        dBodyMesh,
        dBodyOutline,
        dHead,
        dCog,
        dCogProjection,
        ...dLegs,
        dSupportPolygon,
        hXaxis,
        hYaxis,
        hZaxis,
        wXaxis,
        wYaxis,
        wZaxis,
    ]
}

const getNewPlotParams = (hexapod, cameraView) => {
    const data = _drawHexapod(hexapod)

    const range = hexapod.sumOfDimensions
    const newRange = [-range, range]
    const xaxis = { ...SCENE.xaxis, range: newRange }
    const yaxis = { ...SCENE.yaxis, range: newRange }
    const zaxis = { ...SCENE.zaxis, range: [-10, 2 * range - 10] }
    const scene = {
        ...SCENE,
        xaxis,
        yaxis,
        zaxis,
        camera: cameraView,
    }

    const layout = { ...LAYOUT, scene }

    return [data, layout]
}

export default getNewPlotParams