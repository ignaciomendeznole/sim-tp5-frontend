import "./App.css";
import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [simulacionData, setSimulacionData] = useState({
    numSimulaciones: "",
    relojDesde: "",
    relojHasta: "",
    probabilidadComprar: "",
    probabilidadReparar: "",
    probabilidadRetirar: "",
    repUniformeA: "",
    repUniformeB: "",
    ventaUniformeA: "",
    ventaUniformeB: "",
    llegada_clienteA: "",
    llegada_clienteB: "",
  });

  const [validForm, setValidForm] = useState(true);

  const {
    numSimulaciones,
    relojDesde,
    relojHasta,
    probabilidadComprar,
    probabilidadReparar,
    probabilidadRetirar,
    repUniformeA,
    repUniformeB,
    ventaUniformeA,
    ventaUniformeB,
    llegada_clienteA,
    llegada_clienteB,
  } = simulacionData;

  const updateForm = (e) => {
    setSimulacionData({
      ...simulacionData,
      [e.target.name]: e.target.value,
    });
  };

  const checkForm = () => {
    if (
      numSimulaciones === "" ||
      relojDesde === "" ||
      relojHasta === "" ||
      probabilidadComprar === "" ||
      probabilidadReparar === "" ||
      probabilidadRetirar === "" ||
      repUniformeA === "" ||
      repUniformeB === "" ||
      ventaUniformeA === "" ||
      ventaUniformeB === "" ||
      llegada_clienteA === "" ||
      llegada_clienteB === ""
    ) {
      setValidForm(false);
    } else {
      setValidForm(true);
    }
  };

  const startSimulation = () => {
    checkForm();
  };

  return (
    <div className='App'>
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

        <div className='input-fields'>
          <Row>
            <Form>
              <Form.Group>
                <Form.Label>Número de Simulaciones</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresar número de simulaciones'
                  className='simulation-input'
                  value={numSimulaciones}
                  name='numSimulaciones'
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
                  type='text'
                  placeholder='Ingresar Reloj de inicio'
                  className='simulation-input'
                  value={relojDesde}
                  name='relojDesde'
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
                  type='text'
                  placeholder='Ingresar Reloj de fin'
                  className='simulation-input'
                  value={relojHasta}
                  name='relojHasta'
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
                    Distribución Uniforme entre{" "}
                    <input
                      type='text'
                      value={llegada_clienteA}
                      name='llegada_clienteA'
                      onChange={updateForm}
                    ></input>{" "}
                    y{" "}
                    <input
                      type='text'
                      value={llegada_clienteB}
                      name='llegada_clienteB'
                      onChange={updateForm}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de atención (para venta)</td>
                  <td>
                    Distribución Uniforme entre{" "}
                    <input
                      type='text'
                      value={ventaUniformeA}
                      name='ventaUniformeA'
                      onChange={updateForm}
                    ></input>{" "}
                    y{" "}
                    <input
                      type='text'
                      value={ventaUniformeB}
                      name='ventaUniformeB'
                      onChange={updateForm}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de reparación de relojes</td>
                  <td>
                    Distribución Uniforme entre{" "}
                    <input
                      type='text'
                      value={repUniformeA}
                      name='repUniformeA'
                      onChange={updateForm}
                    ></input>{" "}
                    y{" "}
                    <input
                      type='text'
                      value={repUniformeB}
                      name='repUniformeB'
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
                      value={probabilidadComprar}
                      name='probabilidadComprar'
                      onChange={updateForm}
                      placeholder='Ingrese la probabilidad de que un cliente compre un reloj'
                    />{" "}
                    %
                  </td>
                </tr>
                <tr>
                  <td>Reparar</td>
                  <td>
                    <input
                      type='text'
                      value={probabilidadReparar}
                      name='probabilidadReparar'
                      onChange={updateForm}
                      placeholder='Ingrese la probabilidad de que un cliente repare un reloj'
                    />{" "}
                    %
                  </td>
                </tr>
                <tr>
                  <td>Retirar relojes</td>
                  <td>
                    <input
                      type='text'
                      value={probabilidadRetirar}
                      name='probabilidadRetirar'
                      onChange={updateForm}
                      placeholder='Ingrese la probabilidad de que un cliente retire un reloj'
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
          variant='primary'
          lg
          className='simulate-btn'
          onClick={startSimulation}
        >
          SIMULAR
        </Button>
        {/* <Row>
          <Col>
            <h2>Otros costos:</h2>
            <h3>Almacenamiento (KM): $3 por dia por unidad</h3>
            <h3>Ruptura (KS): $4 por dia por unidad</h3>
          </Col>
        </Row> */}
        <br />
        <Row>
          <Col>
            <h1>SIMULACIÓN</h1>
          </Col>
          <Table striped bordered hover variant='dark'>
            <thead>
              <th colSpan={3}>EVENTOS</th>
              <th colSpan={3}>LLEGADA CLIENTE</th>
              <th colSpan={2}>ATENCIÓN</th>
              <th colSpan={2}>DEMORA</th>
              <th colSpan={5}>AYUDANTE</th>
              <th colSpan={4}>RELOJERO</th>
              <th colSpan={1}>TIENDA</th>

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
              {/* {simulacion.map((simulation, i) => {
                clientes.map((cliente, index) => {
                  return (
                    <tr key={i}>
                      <td>{simulation.nombre}</td>
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
                      <td>{cliente.id}</td>
                      <td>{cliente.state.name}</td>
                      <td>{cliente.state.description}</td>
                    </tr>
                  );
                });
              })} */}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
}

export default App;
