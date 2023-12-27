const data = "" import java.util.*;
import java.io.*;

public class Converter {
  public static void main(String[] args) {
    String file = args[0] readFile(file)
  }

  public File readFile(File path) {
    FileReader fr = new FileReader(path);
    FileWriter fw = new FileWriter("output.txt");

    String str = "";

    int i;
    // Condition check
    // Reading the file using read() method which
    // returns -1 at EOF while reading
    while ((line = fr.readLine()) != null) {
      // checking to see if it's the date mood string
      if (line.contains("2023-")) {
        String[] tokens = s.split("/");
        str += `${tokens[0]}, $ {
          tokens[1]
        }
        \n`
      }
    }

    // Print and display the string that
    // contains file data
    System.out.println(str);

    // Writing above string data to
    // FileWriter object
    fw.write(str);

    // Closing the file using close() method
    // of Reader class which closes the stream &
    // release resources that were busy in stream
    fr.close();
    fw.close();
  }
}