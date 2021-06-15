import './App.css';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

function App() {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  const [simulacionData, setSimulacionData] = useState({
    ultimoReloj: 1000,
    relojDesde: 115,
    relojHasta: 300,
    integrationStep: 0.1,
    fixSpeedValue: 5,
    probabilidadComprar: 45,
    probabilidadReparar: 25,
    probabilidadRetirar: 30,
    repUniformeA: 18,
    repUniformeB: 22,
    ventaUniformeA: 6,
    ventaUniformeB: 10,
    llegadaClienteA: 13,
    llegadaClienteB: 17,
    initTime: 115,
  });

  const [cantClientesUnicos, setCantClientesUnicos] = useState(0);
  const [setClientes, setSetClientes] = useState(new Set());

  const [simulacion, setSimulacion] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);

  const updateForm = (e) => {
    setSimulacionData({
      ...simulacionData,
      [e.target.name]: e.target.value,
    });
  };

  const mapClients = (simulationData) => {
    const clientesSet = new Set();
    simulationData.forEach((simulation) => {
      simulation.clientes.forEach((cliente) => {
        clientesSet.add(cliente.id);
      });
    });
    setCantClientesUnicos(clientesSet.size);
    setSetClientes(clientesSet);
  };

  const fetchInformation = async () => {
    const BASE_URL = 'http://172.105.159.186:5000';
    try {
      let {
        initTime,
        ultimoReloj,
        relojDesde,
        relojHasta,
        probabilidadComprar,
        probabilidadReparar,
        probabilidadRetirar,
        repUniformeA,
        repUniformeB,
        ventaUniformeA,
        ventaUniformeB,
        llegadaClienteA,
        llegadaClienteB,
        integrationStep,
        fixSpeedValue,
      } = simulacionData;

      console.log(simulacionData);
      const response = await axios.post(`${BASE_URL}/api/run-simulation`, {
        ultimoReloj,
        fixSpeedValue,
        relojDesde,
        initTime,
        relojHasta,
        probabilidadComprar: probabilidadComprar / 100,
        probabilidadReparar: probabilidadReparar / 100,
        probabilidadRetirar: probabilidadRetirar / 100,
        repUniformeA,
        repUniformeB,
        ventaUniformeA,
        ventaUniformeB,
        llegadaClienteA,
        llegadaClienteB,
        integrationStep,
      });

      console.log(response.data);
      mapClients(response.data);
      setSimulacion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkForm = () => {
    let {
      ultimoReloj,
      fixSpeedValue,
      relojDesde,
      relojHasta,
      probabilidadComprar,
      probabilidadReparar,
      probabilidadRetirar,
      repUniformeA,
      repUniformeB,
      ventaUniformeA,
      ventaUniformeB,
      llegadaClienteA,
      llegadaClienteB,
      initTime,
      integrationStep,
    } = simulacionData;

    if (
      isNaN(Number.parseFloat(ultimoReloj)) ||
      isNaN(Number.parseFloat(fixSpeedValue)) ||
      isNaN(Number.parseFloat(relojDesde)) ||
      isNaN(Number.parseFloat(relojHasta)) ||
      isNaN(Number.parseFloat(probabilidadComprar)) ||
      isNaN(Number.parseFloat(probabilidadReparar)) ||
      isNaN(Number.parseFloat(probabilidadRetirar)) ||
      isNaN(Number.parseFloat(repUniformeA)) ||
      isNaN(Number.parseFloat(repUniformeB)) ||
      isNaN(Number.parseFloat(ventaUniformeA)) ||
      isNaN(Number.parseFloat(ventaUniformeB)) ||
      isNaN(Number.parseFloat(llegadaClienteA)) ||
      isNaN(Number.parseFloat(llegadaClienteB)) ||
      isNaN(Number.parseFloat(initTime)) ||
      isNaN(Number.parseFloat(integrationStep))
    ) {
      return { validForm: false, errorMessage: 'Campos invalidos ' };
    }

    if (Number.parseFloat(relojDesde) > Number.parseFloat(relojHasta)) {
      return {
        validForm: false,
        errorMessage: 'El campo mostrar reloj desde debe ser mayor al hasta',
      };
    }

    if (Number.parseFloat(initTime) > Number.parseFloat(ultimoReloj))
      return {
        validForm: false,
        errorMessage: 'El inicio de la simulacion debe ser menor que el fin',
      };

    if (Number.parseFloat(repUniformeA) > Number.parseFloat(repUniformeB))
      return {
        validForm: false,
        errorMessage: 'En las distribuciones uniformes, A debe ser menor a B',
      };

    if (Number.parseFloat(ventaUniformeA) > Number.parseFloat(ventaUniformeB))
      return {
        validForm: false,
        errorMessage: 'En las distribuciones uniformes, A debe ser menor a B',
      };
    if (Number.parseFloat(llegadaClienteA) > Number.parseFloat(llegadaClienteB))
      return {
        validForm: false,
        errorMessage: 'En las distribuciones uniformes, A debe ser menor a B',
      };

    if (
      Number.parseFloat(probabilidadComprar) +
        Number.parseFloat(probabilidadReparar) +
        Number.parseFloat(probabilidadRetirar) !==
      100
    ) {
      return {
        validForm: false,
        errorMessage: 'La suma de las probabilidades debe ser 100%',
      };
    }

    return { validForm: true };
  };

  const startSimulation = (e) => {
    let { validForm, errorMessage } = checkForm();
    if (!validForm) {
      return alert(`Error: ${errorMessage}`);
    }
    return fetchInformation();
  };

  return (
    <div className='App'>
      <Container fluid>
        <Row>
          <Col>
            <h1>Simulación de Modelos Dinámicos: Colas</h1>
          </Col>
        </Row>
        <p style={{ color: 'red' }}>
          ¡Debes completar todos los campos para comenzar la simulación!
        </p>

        <div className='input-fields'>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Reloj de inicialización (minutos)</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresar inicio de la simulacion'
                  className='simulation-input'
                  value={simulacionData.initTime}
                  name='initTime'
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form></Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Mostrar Reloj desde (minutos):</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresar Reloj de inicio'
                  className='simulation-input'
                  value={simulacionData.relojDesde}
                  name='relojDesde'
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Mostrar Reloj hasta (minutos):</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresar Reloj de fin'
                  className='simulation-input'
                  value={simulacionData.relojHasta}
                  name='relojHasta'
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Constante de reparación de relojes "A"</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresar valor de constante de reparación'
                  className='simulation-input'
                  value={simulacionData.fixSpeedValue}
                  name='fixSpeedValue'
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Paso de Integración "h"</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresar valor del paso de integración'
                  className='simulation-input'
                  value={simulacionData.integrationStep}
                  name='integrationStep'
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
        </div>

        <Row>
          <Col lg='14'>
            <h1>Distribuciones</h1>
            <Table striped bordered hover variant='dark' size='sm'>
              <thead>
                <tr>
                  <th>Distribuciones</th>
                  <th>Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Llegada Clientes</td>
                  <td>
                    Distribución Uniforme entre{' '}
                    <input
                      type='text'
                      value={simulacionData.llegadaClienteA}
                      name='llegadaClienteA'
                      onChange={updateForm}
                    ></input>{' '}
                    y{' '}
                    <input
                      type='text'
                      value={simulacionData.llegadaClienteB}
                      name='llegadaClienteB'
                      onChange={updateForm}
                    />
                    minutos
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de atención (para venta)</td>
                  <td>
                    Distribución Uniforme entre{' '}
                    <input
                      type='text'
                      value={simulacionData.ventaUniformeA}
                      name='ventaUniformeA'
                      onChange={updateForm}
                    ></input>{' '}
                    y{' '}
                    <input
                      type='text'
                      value={simulacionData.ventaUniformeB}
                      name='ventaUniformeB'
                      onChange={updateForm}
                    />
                    minutos
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de reparación de relojes</td>
                  <td>
                    Distribución Uniforme entre{' '}
                    <input
                      type='text'
                      value={simulacionData.repUniformeA}
                      name='repUniformeA'
                      onChange={updateForm}
                    ></input>{' '}
                    y{' '}
                    <input
                      type='text'
                      value={simulacionData.repUniformeB}
                      name='repUniformeB'
                      onChange={updateForm}
                    />
                    minutos
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de atencion para retiro o entrega</td>
                  <td>3 Minutos</td>
                </tr>
              </tbody>
            </Table>
          </Col>

          <Col xs lg='4'>
            <h1>Probabilidades</h1>
            <Table striped bordered hover variant='dark' size='sm'>
              <thead>
                <tr>
                  <th>Tipo de Atención</th>
                  <th>Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Comprar</td>
                  <td>
                    <input
                      type='text'
                      value={simulacionData.probabilidadComprar}
                      name='probabilidadComprar'
                      onChange={updateForm}
                      placeholder='Ingrese la probabilidad de que un cliente compre un reloj'
                    />{' '}
                    %
                  </td>
                </tr>
                <tr>
                  <td>Reparar</td>
                  <td>
                    <input
                      type='text'
                      value={simulacionData.probabilidadReparar}
                      name='probabilidadReparar'
                      onChange={updateForm}
                      placeholder='Ingrese la probabilidad de que un cliente repare un reloj'
                    />{' '}
                    %
                  </td>
                </tr>
                <tr>
                  <td>Retirar relojes</td>
                  <td>
                    <input
                      type='text'
                      value={simulacionData.probabilidadRetirar}
                      name='probabilidadRetirar'
                      onChange={updateForm}
                      placeholder='Ingrese la probabilidad de que un cliente retire un reloj'
                    />{' '}
                    %
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <br />
        <h2>Estados</h2>
        <p>SAR: Siendo atendido retiro</p>
        <p>SAE: Siendo atendido entrega</p>
        <p>SAC: Siendo atendido compra</p>
        <p>EEA: En espera atencion</p>

        <Button
          variant='primary'
          className='simulate-btn'
          onClick={startSimulation}
        >
          SIMULAR
        </Button>

        <br />
        <Row style={{ marginLeft: '5px' }}>
          {simulacion !== null ? (
            <h2>
              Porcentaje de ocupacion del relojero:{' '}
              {(simulacion[simulacion.length - 1].relojero.tiempoOcupacion /
                simulacion[simulacion.length - 1].reloj) *
                100}
            </h2>
          ) : null}
        </Row>

        <Row style={{ marginLeft: '5px' }}>
          {simulacion !== null ? (
            <h2>
              Porcentaje de ocupacion del ayudante:{' '}
              {(simulacion[simulacion.length - 1].ayudante.tiempoOcupacion /
                simulacion[simulacion.length - 1].reloj) *
                100}
            </h2>
          ) : null}
        </Row>
        <Row style={{ marginLeft: '5px' }}>
          {simulacion !== null ? (
            <h2>
              Probabilidad de que un cliente vaya a retirar un reloj y todavía
              no esté listo:{' '}
              {(simulacion[simulacion.length - 1].ayudante.tiempoOcupacion /
                simulacion[simulacion.length - 1].reloj) *
                100}
            </h2>
          ) : null}
        </Row>
        <Row>
          <Col>
            <h1>SIMULACIÓN</h1>
          </Col>

          <MuiThemeProvider theme={theme}></MuiThemeProvider>

          <Table striped bordered hover variant='dark'>
            <thead style={{ position: 'sticky' }}>
              <tr>
                <th colSpan={3}>EVENTOS</th>
                <th colSpan={3}>LLEGADA CLIENTE</th>
                <th colSpan={2}>ATENCIÓN</th>
                <th colSpan={2}>DEMORA</th>
                <th colSpan={5}>AYUDANTE</th>
                <th colSpan={7}>RELOJERO</th>
                <th colSpan={1}>TIENDA</th>
                <th colSpan={1}></th>
                <th colSpan={cantClientesUnicos}>CLIENTES</th>
              </tr>
              <tr>
                <th>Número Simulación</th>
                <th>Evento</th>
                <th>Reloj</th>
                <th>RND Llegada</th>
                <th>Tiempo Llegada</th>
                <th>Próxima Llegada</th>
                <th>RND Atencion</th>
                <th>Atención</th>
                <th>RND Demora</th>
                <th>Demora</th>
                <th>Estado</th>
                <th>Cola</th>
                <th>Fin Atención</th>
                <th>Tiempo de Ocupación</th>
                <th>Tipo de Ocupación</th>
                <th>Estado</th>
                <th>Cola</th>
                <th>RND Complejidad</th>
                <th>Complejidad</th>
                <th>Tiempo de reparación</th>
                <th>Fin Reparación</th>
                <th>Tiempo de Ocupación</th>
                <th>Relojes a Retirar</th>
                <th>Próximo Evento</th>
                {Array.from(setClientes).map((clientId, i) => (
                  <th key={i}>{clientId}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {simulacion !== null
                ? simulacion.map((simulation, i) => {
                    //simulation.clientes.map((cliente, index) => {
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelectedRow(i)}
                        style={{
                          backgroundColor:
                            selectedRow === i ? 'darkcyan' : null,
                        }}
                      >
                        <td>{simulation.numeroSimulacion}</td>
                        <td>{simulation.evento}</td>
                        <td>{simulation.reloj}</td>
                        <td>{simulation.llegada.random}</td>
                        <td>{simulation.llegada.tiempoLlegada}</td>
                        <td>{simulation.llegada.proximaLlegada}</td>
                        <td>{simulation.atencion.random}</td>
                        <td>{simulation.atencion.tipo}</td>
                        <td>{simulation.demora.random}</td>
                        <td>{simulation.demora.tiempoDemora}</td>
                        <td>{simulation.ayudante.estado}</td>
                        <td>{simulation.ayudante.cola}</td>
                        <td>{simulation.ayudante.finAtencion}</td>
                        <td>{simulation.ayudante.tiempoOcupacion}</td>
                        <td>{simulation.ayudante.tipoOcupacion}</td>
                        <td>{simulation.relojero.estado}</td>
                        <td>{simulation.relojero.cola}</td>
                        <td>{simulation.relojero.finAtencion}</td>
                        <td>{simulation.relojero.tiempoOcupacion}</td>
                        <td>{simulation.relojesRetirar}</td>
                        <td>{simulation.proximoEvento}</td>
                        {Array.from(setClientes).map((clientId, i) => (
                          <td key={i}>
                            {simulation.clientes.map((cliente) => {
                              return cliente.id === clientId ? (
                                <p>
                                  ID: {cliente.id} Estado: {cliente.state.name}
                                </p>
                              ) : null;
                            })}
                          </td>
                        ))}
                      </tr>
                    );
                    //});
                  })
                : null}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
}

export default App;
