import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
  } from "react-router-dom";

import SeguimientoInsumos from './components/supplyIn/SeguimientoInsumos';
import RegistroInsumos from './components/supplyIn/RegistroInsumos';
import Dashboard from './components/supplyIn/Dashboard';

//Recetas
import SeguimientoRecetas from './components/recetas/SeguimientoRecetas';
import DashboardRecetas from './components/recetas/Dashboard';

class navBar extends Component {
    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">BEST - INDUSTRIAL</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                       
                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Materia Prima
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/seguimientoinsumos">Seguimiento Insumos</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="/dashboardinsumos">Dashboard Insumos</a></li>
                        </ul>
                        </li>

                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Recetas de Produccion
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/seguimientorecetas">Seguimiento Recetas</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="/dashboardrecetas">Dashboard Recetas</a></li>
                        </ul>
                        </li>

                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Produccion
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/seguimientoinsumos">Seguimiento Produccion</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="/registroinsumos">Registro Orden Produccion</a></li>
                        </ul>
                        </li>

                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Salidas Producto Terminado
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/seguimientoinsumos">Seguimiento Produccion</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="/registroinsumos">Registro Orden Produccion</a></li>
                        </ul>
                        </li>

                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Reportes
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/seguimientoinsumos">Seguimiento Produccion</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="/registroinsumos">Registro Orden Produccion</a></li>
                        </ul>
                        </li>
                    </ul>    

                                  
                    </div>
                    <button className="btn btn-danger btn-lg my-2" onClick={() => this.props.logoutHandler()}>Salir</button> 
                </div>
                </nav>

                {/* main content declaration */}
                <div className="main-menu-content" id="maintext">
                    <div className="menu-content">   
                        <Routes>
                            <Route path="/seguimientoinsumos" element={<SeguimientoInsumos></SeguimientoInsumos>} />
                            <Route path="/dashboardinsumos" element={<Dashboard></Dashboard>} />

                            <Route path='/seguimientorecetas' element={<SeguimientoRecetas></SeguimientoRecetas>} />
                            <Route path='/dashboardrecetas' element={<DashboardRecetas></DashboardRecetas>} />
                        </Routes>                    
                    </div>
                </div>
            </>
        );
    }
}

export default navBar;