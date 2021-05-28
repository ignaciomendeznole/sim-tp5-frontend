import "./App.css";
import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function App() {
  const [simulacionData, setSimulacionData] = useState({
    ultimoReloj: 1000,
    relojDesde: 115,
    relojHasta: 300,
    probabilidadComprar: 45,
    probabilidadReparar: 25,
    probabilidadRetirar: 3,
    repUniformeA: 18,
    repUniformeB: 22,
    ventaUniformeA: 6,
    ventaUniformeB: 10,
    llegadaClienteA: 13,
    llegadaClienteB: 17,
    initTime: 115,
  });

  const [simulacion, setSimulacion] = useState(null);

  const [validForm, setValidForm] = useState(false);

  const swalClientes = withReactContent(Swal);

  const updateForm = (e) => {
    console.log(e.target.value);
    setSimulacionData({
      ...simulacionData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchInformation = async () => {
    const BASE_URL = "http://127.0.0.1:5000";
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
      } = simulacionData;

      console.log(simulacionData);
      const response = await axios.post(`${BASE_URL}/api/run-simulation`, {
        ultimoReloj,
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
      });

      console.log(response.data);

      setSimulacion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkForm = () => {
    let {
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
    } = simulacionData;

    if (
      ultimoReloj === null ||
      relojDesde === null ||
      relojHasta === null ||
      probabilidadComprar === null ||
      probabilidadReparar === null ||
      probabilidadRetirar === null ||
      repUniformeA === null ||
      repUniformeB === null ||
      ventaUniformeA === null ||
      ventaUniformeB === null ||
      llegadaClienteA === null ||
      llegadaClienteB === null
    ) {
      setValidForm(false);
    } else {
      setValidForm(true);
    }
  };

  const startSimulation = (e) => {
    return fetchInformation();
    e.preventDefault();
    checkForm();
    if (!validForm) {
      return;
    } else {
      fetchInformation();
    }
  };

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <h1>Simulación de Modelos Dinámicos: Colas</h1>
          </Col>
        </Row>
        {validForm ? null : (
          <p style={{ color: "red" }}>
            ¡Debes completar todos los campos para comenzar la simulación!
          </p>
        )}

        <div className="input-fields">
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Inicio de la simulacion</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar inicio de la simulacion"
                  className="simulation-input"
                  value={simulacionData.initTime}
                  name="initTime"
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Fin del reloj</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar número de simulaciones"
                  className="simulation-input"
                  value={simulacionData.ultimoReloj}
                  name="ultimoReloj"
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Mostrar Reloj desde</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar Reloj de inicio"
                  className="simulation-input"
                  value={simulacionData.relojDesde}
                  name="relojDesde"
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Mostrar Reloj hasta</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar Reloj de fin"
                  className="simulation-input"
                  value={simulacionData.relojHasta}
                  name="relojHasta"
                  onChange={updateForm}
                />
              </Form.Group>
            </Form>
          </Row>
        </div>

        <Row>
          <Col lg="14">
            <h1>Distribuciones</h1>
            <Table striped bordered hover variant="dark" size="sm">
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
                    Distribución Uniforme entre{" "}
                    <input
                      type="text"
                      value={simulacionData.llegadaClienteA}
                      name="llegadaClienteA"
                      onChange={updateForm}
                    ></input>{" "}
                    y{" "}
                    <input
                      type="text"
                      value={simulacionData.llegadaClienteB}
                      name="llegadaClienteB"
                      onChange={updateForm}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de atención (para venta)</td>
                  <td>
                    Distribución Uniforme entre{" "}
                    <input
                      type="text"
                      value={simulacionData.ventaUniformeA}
                      name="ventaUniformeA"
                      onChange={updateForm}
                    ></input>{" "}
                    y{" "}
                    <input
                      type="text"
                      value={simulacionData.ventaUniformeB}
                      name="ventaUniformeB"
                      onChange={updateForm}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de reparación de relojes</td>
                  <td>
                    Distribución Uniforme entre{" "}
                    <input
                      type="text"
                      value={simulacionData.repUniformeA}
                      name="repUniformeA"
                      onChange={updateForm}
                    ></input>{" "}
                    y{" "}
                    <input
                      type="text"
                      value={simulacionData.repUniformeB}
                      name="repUniformeB"
                      onChange={updateForm}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de atencion para retiro o entrega</td>
                  <td>3 Minutos</td>
                </tr>
              </tbody>
            </Table>
          </Col>

          <Col xs lg="4">
            <h1>Probabilidades</h1>
            <Table striped bordered hover variant="dark" size="sm">
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
                      type="text"
                      value={simulacionData.probabilidadComprar}
                      name="probabilidadComprar"
                      onChange={updateForm}
                      placeholder="Ingrese la probabilidad de que un cliente compre un reloj"
                    />{" "}
                    %
                  </td>
                </tr>
                <tr>
                  <td>Reparar</td>
                  <td>
                    <input
                      type="text"
                      value={simulacionData.probabilidadReparar}
                      name="probabilidadReparar"
                      onChange={updateForm}
                      placeholder="Ingrese la probabilidad de que un cliente repare un reloj"
                    />{" "}
                    %
                  </td>
                </tr>
                <tr>
                  <td>Retirar relojes</td>
                  <td>
                    <input
                      type="text"
                      value={simulacionData.probabilidadRetirar}
                      name="probabilidadRetirar"
                      onChange={updateForm}
                      placeholder="Ingrese la probabilidad de que un cliente retire un reloj"
                    />{" "}
                    %
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <br />

        <Button
          variant="primary"
          className="simulate-btn"
          onClick={startSimulation}
        >
          SIMULAR
        </Button>

        <br />
        <Row style={{ marginLeft: "5px" }}>
          {simulacion !== null ? (
            <h2>
              Porcentaje de ocupacion del relojero:{" "}
              {(simulacion[simulacion.length - 1].relojero.tiempoOcupacion /
                simulacion[simulacion.length - 1].reloj) *
                100}
            </h2>
          ) : null}
        </Row>

        <Row style={{ marginLeft: "5px" }}>
          {simulacion !== null ? (
            <h2>
              Porcentaje de ocupacion del ayudante:{" "}
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

          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th colSpan={3}>EVENTOS</th>
                <th colSpan={3}>LLEGADA CLIENTE</th>
                <th colSpan={2}>ATENCIÓN</th>
                <th colSpan={2}>DEMORA</th>
                <th colSpan={5}>AYUDANTE</th>
                <th colSpan={4}>RELOJERO</th>
                <th colSpan={1}>TIENDA</th>
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
                <th>Fin Reparación</th>
                <th>Tiempo de Ocupación</th>
                <th>Relojes a Retirar</th>
                <th>Próximo Evento</th>
                <th>Clientes</th>
              </tr>
            </thead>
            <tbody>
              {simulacion !== null
                ? simulacion.map((simulation, i) => {
                    //simulation.clientes.map((cliente, index) => {
                    return (
                      <tr key={i}>
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
                        <td>
                          <Button
                            onClick={() => {
                              swalClientes
                                .fire({
                                  title: <p>Clientes</p>,
                                  footer: "Copyright 2018",
                                  didOpen: () => {
                                    // `MySwal` is a subclass of `Swal`
                                    //   with all the same instance & static methods
                                    swalClientes.clickConfirm();
                                  },
                                })
                                .then(() => {
                                  return swalClientes.fire(
                                    <>
                                      {simulacion.clientes
                                        ? simulation.clientes.map(
                                            (cliente, index) => {
                                              return (
                                                <p style={{ fontSize: "20px" }}>
                                                  Cliente: {cliente.id} Estado:{" "}
                                                  {cliente.state.description}
                                                </p>
                                              );
                                            }
                                          )
                                        : null}
                                    </>
                                  );
                                });
                            }}
                          >
                            Ver clientes
                          </Button>
                        </td>
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
