import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Inversion } from './Models/inversion';
import { InversionCalculada } from './Models/inversionCalculada';
import { InversionService } from './Service/inversion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  //vARIABLES PARA MOSTRAR EL MENSAJE Y LA DESCRIPCION EN EL MODAL
  public TituloModal!: string;
  public DescripcionModal!: string;

  //VARIABLES QUE NOS PERMITIRÁN CALCULAR Y ALMACENAR LAS SUMATORIAS DE NUESTRA INVERSION CALCULADA
  private SumatoriaAportaciones: number = 0;
  public GananciaFinal: number = 0;
  private MontoInicial: number = 0;
  public MontoFinal: number = 0;

  //VARIABLE QUE PERMITIRÁ INDICAR SI TODOS LOS DATOS PROPORCIONADOS SON CORRECTOS PARA SU POSTERIOR CALCULO
  public RealizarCalculo!: boolean;

  public FormInversion: UntypedFormGroup; //DECLARAMOS UNA VARIABLE QUE PERMITIRÁ IDENTIFICAR A NUESTRO FORMULARIO
  public DatosInversion: Inversion = new Inversion(); //DECLARAMOS LA CLASE INVERSIÓN PARA ALMACENAR TODOS LOS DATOS CAPTURADOS DEL FORMULARIO
  public ListaInversiones: InversionCalculada[] = []; //DECLARAMOS UN ARREGLO DE NUESTRA CLASE INVERSIONCALCULADA PARA ALMACENAR TODOS LOS DATOS DE SALIDA RELACIONADA A LA INVERSIÓN CALCULADA

  //DECLARAMOS EN EL CONSTRUCTOR NUESTRO SERVICIO PARA REALIZAR EL ENVIO MEDIANTE HTTP POST
  //TAMBIEN AGREGAMOS ALGUNAS CONDICIONES A NUESTRO FORMULARIO INDICANDOLE CAMPOS LIMPIOS Y QUE TODOS LOS CAMPOS DEBEN CONTENER UN VALOR
  constructor(private inversionService: InversionService) {
    this.FormInversion = new UntypedFormGroup({
      InversionInicial: new UntypedFormControl('', [Validators.required]),
      AportacionAnual: new UntypedFormControl('', [Validators.required]),
      PorcentajeIncremento: new UntypedFormControl('', [Validators.required]),
      AniosInversion: new UntypedFormControl('', [Validators.required]),
      PorcentajeRendimiento: new UntypedFormControl('', [Validators.required]),
    })
  }

  //CREAMOS UN MÉTODO QUE NOS PERMITIRA ENVIAR NUESTROS DATOS PARA LA INVERSIÓN A NUESTRO SERVICIO QUE ESTA COMUNICADO CON EL BACKEND
  EnviarDatosInversion(): any {
    //ANTES QUE NADA PERMITE VALIDAR EL FORMULARIO PARA CONFIRMAR SI SE CUMPLEN CON ALGUNAS CONDICIONES
    this.ValidandoFormulario();

    //PREGUNTA SI LA VARIABLE REALIZARCALCULO ES VERDADERO, SI ES ASI ACCEDE AL SIGUIENTE BLOQUE DE CODIGO
    if (this.RealizarCalculo == true) {

        //LLAMAMOS AL MÉTODO ENVIANDOINVERSION QUE SE ENCUENTRA EN EL SERVICE CON TODOS LOS DATOS CAPTURADOS DE NUESTRO FORMULARIO
        //UNA VEZ REALIZADO Y RETORNADO LA LISTA DE LA INVERSION CALCULADA HACE UNA SUSCRIPCION PARA REALIZAR LO SIGUIENTE
        this.inversionService.EnviandoInversion(this.DatosInversion).subscribe((InversionCalculada: any) => {

            //DECLARAMOS LAS SIGUIENTES VARIABLES QUE PERMITIRÁN ALMACENAR ALGUNOS VALORES PARA MOSTRARLOS EN EL FRONTEND
            this.MontoInicial = 0, this.MontoFinal = 0, this.GananciaFinal = 0, this.SumatoriaAportaciones = 0;

            //lA LISTA DE INVERSIONCALCULADA LA ENVIAMOS A NUESTRA LISTA ASIGNADA A LA CLASE PARA ALMACENAR LOS DATOS
            this.ListaInversiones = InversionCalculada;
            //POR DEFECTO EL MONTOINICIAL ALMACENARÁ EL PRIMER VALOR DE LA LISTA QUE SE ENCUENTRE EN EL CAMPO SALDOINICIAL
            this.MontoInicial = this.ListaInversiones[0].saldoInicial;

            //REALIZAMOS UN CICLO PARA REALIZAR LA SUMA DE TODAS LAS APORTACIONES DE LOS AÑOS DE INVERSIÓN
            //ASI COMO TAMBIÉN ALMACENAR EL ULTIMO VALOR DEL SALDOFINAL EN NUESTRA VARIABLE GANANCIAFINAL
            for (let index = 0; index < this.ListaInversiones.length; index++) {
                this.SumatoriaAportaciones = this.SumatoriaAportaciones + this.ListaInversiones[index].aportacion;
                this.GananciaFinal = this.ListaInversiones[index].saldoFinal;
            }

            //OBTENIDOS TODOS LOS DATOS REALIZAMOS LA RESTA PARA OBTENER EL VALOR DE NUESTRO MONTO FINAL
            this.MontoFinal = this.GananciaFinal - this.MontoInicial - this.SumatoriaAportaciones;

        });
    
      }

  }

  ValidandoFormulario() {
      //DICHAS CONDICIONES SON LAS SIGUIENTES: SI EL FORMULARIO CONTIENE CAMPOS VACIOS, MOSTRARA EL SIGUIENTE TITULO Y DESCRIPCION EN UN MODAL
      if (!this.FormInversion.valid) {
          this.TituloModal = "Ups, hemos encontrado un error";
          this.DescripcionModal = "Faltan campos por llenar, por favor verifica y termina de acompletar todos los campos vacios";
          this.RealizarCalculo = false;
      //CASO CONTRARIO EN CASO DE LA INVERSIÓN INICIAL SEA MENOR DE 1000 O QUE LOS AÑOS DE INVERSIÓN ES MENOR DE 1, SALTARÁ UN MODAL DE ERROR CON LA SIGUIENTE INFORMACIÓN
      } else if (this.FormInversion.controls['InversionInicial'].value < 1000 || this.FormInversion.controls['AniosInversion'].value < 1) {
          this.TituloModal = "Error al momento de calcular";
          this.DescripcionModal = "No es posible procesar su solicitud con los datos proporcionados. Verifique sus datos por favor";
          this.RealizarCalculo = false;
      //CASO CONTRARIO SI TODOS LOS CAMPOS CUMPLEN CON SU VALIDEZ ENTONCES PERMITIRÁ REALIZAR EL ENVIO A NUESTRO BACKEND
      //MEDIANTE NUESTRO SERVICIO, GRACIAS A LA VARIABLE REALIZARCALCULO QUE CAMBIARÁ SU VALOR PARA PERMITIR DICHA SOLICITUD
      } else {
          this.TituloModal = "Inversión calculada";
          this.DescripcionModal = "Aqui tienes los datos calculados de tu inversión de acuerdo con los años ingresados";
          this.RealizarCalculo = true;
      }

      
  }

}
