import React, { Component } from 'react';
import BestImg from '../../images/bestIconoSolo.png';

class MpinputPdf extends Component {
    constructor() {
        super();
        this.state = {
            todayDate: ''
        }
    }
    

    componentDidMount(){
        console.log(this.props.data[0].fechaVencimiento)
        console.log(this.props.data[0].fechaVencimiento.split(',').length)

        let fechaHoy = new Date();
        let date 
        date = fechaHoy.getFullYear()+'-'+(fechaHoy.getMonth()+1)+'-'+fechaHoy.getDate();

        this.setState({
            todayDate: date
        })
    }

    render() {
        return (
            <div className='pdfContenedor'>    
                <div className='rotuloHeader'>
                            
                <div className="pdfImg"> 
                    <img src={BestImg} style={{ width: '70px', height: '70px' }} className="card-img-top mt-2" />
                </div>

                <div className='rotulosSegundosPdf'>
                    <div className="rotuloBestInustrial">
                        BEST INDUSTRIAL S.A.S
                    </div>
                    <div className="rotuloRotulacionMP">
                        ROTULACION DE MATERIA PRIMA
                    </div>
                </div>                  
              

                <div className="rotuloTerceroPdf">

                    <div className='rotuloNumero'>
                        { this.props.data[0].loteMateriaPrima }
                    </div>

                    <div className='rotuloRevision'>  
                        { this.props.data[0].consecutivo }
                    </div>

                    <div className='rotuloFecha'>
                        { this.state.todayDate } 
                    </div>
                </div>

                </div>    

                <div className='MP'>
                    MATERIA PRIMA
                </div>
                
                <div className='MPdisplay'>  
                    {this.props.data[0].materiaPrima}    
                </div>

                <div className='fEntradafVencimiento'>

                    <div className='fechaEntradaR'>
                        FECHA ENTRADA
                        <div className='fechaEntradaRinput'>
                            {this.props.data[0].fechaEntrada.split('T')[0]}                              
                        </div>
                    </div>

                    <div className='fechaVencimientoR'>
                        FECHA VENICIMIENTO
                        <div className='fechaVencimientoRinput'>   
                            {this.props.data[0].fechaVencimiento.split(',')[0]}                         
                        </div>
                    </div>
                
                </div>

                <div className='pBultoNestibasQM'>

                    <div className='pBulto'>
                        PESO POR BULTO
                        <div className='pBultoInput'>   
                            {this.props.data[0].pesoBulto}                         
                        </div>
                    </div>

                    <div className='Bestibas'>
                        BULTOS POR ESTIBA
                        <div className='BestibasInput'>     
                            {this.props.data[0].bultosEstiba}                      
                        </div>
                    </div>

                    <div className='QM'>
                        QM
                        <div className='QMInput'>
                        </div>
                    </div>

                </div>

                <div className='extencioMateriaPrimaTitulo'>
                    EXTENCIONES DE VIDA DE MATERIA PRIMA
                </div>

                <div className='extencioMateriaPrima'>

                    <div className='ex1'>
                        EXTENCION 1
                        <div className='ex1input'>
                            {this.props.data[0].fechaVencimiento.split(',')[1]}    
                        </div>
                    </div>

                    <div className='ex2'>
                        EXTENCION 2
                        <div className='ex2input'>
                            {this.props.data[0].fechaVencimiento.split(',')[2]}    
                        </div>
                    </div>

                    <div className='ex3'>
                        EXTENCION 3
                        <div className='ex3input'>
                            {this.props.data[0].fechaVencimiento.split(',')[3]}    
                        </div>
                    </div>

                </div>                
            </div>
        );
    }
}

export default MpinputPdf;