package autoupdate_cubesats;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.jsoup.Connection.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Autoupdate_cubesats {
    
    static ArrayList<String> sats = new ArrayList<String>();
    static ArrayList<String> tle_links = new ArrayList<String>();
    static ArrayList<String> escrituraTxt = new ArrayList<String>();

    public static void main(String[] args) throws IOException {
        
        //Cargar los nombres de los satelites y sus direcciones URL a N2YO
        cargarSatsTLE();
        
        JOptionPane.showMessageDialog(null, "Carga de Satelites exitosa: " + sats.size() + " Cubesats fueron Cargados", "Generacion de TLE - CubeSats", JOptionPane.INFORMATION_MESSAGE);
        
        for(int i=0; i<sats.size();i++){
            System.out.println("Satelite en cuestion: " + sats.get(i));
            cargarDatosTLE(sats.get(i), tle_links.get(i));
        }
        
        JOptionPane.showMessageDialog(null, "Obtencion de los datos TLE exitosa.", "Generacion de TLE - CubeSats", JOptionPane.INFORMATION_MESSAGE);
        
        String txtFinal = "";
        for(int i=0; i<escrituraTxt.size();i++){
            txtFinal = txtFinal + escrituraTxt.get(i);
        }
        
        FileUtil futil = new FileUtil();
        
        String date = LocalDate.now().toString().replace("-", "_");
        System.out.println(date);
        String rutaArchivo = "cubesats_" + date + ".txt";
        
        futil.writeToFile(rutaArchivo, txtFinal, true, true);
        
        JOptionPane.showMessageDialog(null, "Archivo " + rutaArchivo + " generado.", "Generacion de TLE - CubeSats", JOptionPane.INFORMATION_MESSAGE);

    }
    
    //Metodo para cargar los datos de los sats
    public static void cargarSatsTLE(){
        BufferedReader br = null;

        //Importar la lista de satelites y sus enlaces a N2YO
        try {

            br = new BufferedReader(new FileReader("cubesats_csv.csv"));
            String line = br.readLine();
            int i = 0;

            while (null != line) {
                //fields[0]=nombres, fields[2]=tle_links
                String[] fields = line.split(",");
                //System.out.println("Fila " + (i+1) + ": " + fields[2]);

                if (i == 0) {
                    // do nothing
                } else {
                    sats.add(fields[0]);
                    tle_links.add(fields[2]);
                }

                line = br.readLine();
                i++;
            }

        } catch (Exception e) {
            System.out.println("Problema: " + e.getMessage());
            JOptionPane.showMessageDialog(null, "Problema al cargar de CSV: " + e.getMessage(), "Generacion de TLE - CubeSats" ,JOptionPane.ERROR_MESSAGE);
            System.exit(0);
        } finally {
            if (null != br) {
                try {
                    br.close();
                } catch (IOException ex) {
                    Logger.getLogger(Autoupdate_cubesats.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
    }
    
    public static void cargarDatosTLE(String nombreSat, String urlTle){
        try {
            //System.out.println("Direccion WEB: " + urlTle);
            Document document = getHtmlDocument(urlTle);
            Element tle = document.getElementById("tle");
            String tleString = tle.toString();
            String[] tleSeparated = tleString.split("\n");
            System.out.println("Lineas TLE del Satelite " + nombreSat);
            System.out.println(tleSeparated[2]);
            System.out.println(tleSeparated[3]);
            escrituraTxt.add(nombreSat + "\n" + tleSeparated[2] + "\n" + tleSeparated[3] + "\n");
        } catch (Exception e) {
            System.out.println("Excepcion en cargar los TLE: " + e.getMessage());
            JOptionPane.showMessageDialog(null, "Excepcion en cargar los TLE del Satelite: " + nombreSat + "\n No hay conexion con el sitio web: " + urlTle + ". Tiempo de conexion excedido", "Generacion de TLE - CubeSats" ,JOptionPane.ERROR_MESSAGE);
            
            //System.exit(0);
        }
    }
    
    //Cargar un documento HTML de internet
    public static Document getHtmlDocument(String url) {

    Document doc = null;
	try {
	    doc = Jsoup.connect(url).userAgent("Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6").timeout(Integer.MAX_VALUE).get();
	    } catch (IOException ex) {
		System.out.println("Excepción al obtener el HTML de la página: " + ex.getMessage());
	    }
    return doc;
}

}
