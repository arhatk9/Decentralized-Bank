import Debug  "mo:base/Debug"; // import Debug
import Time "mo:base/Time"; // import Time
import Float "mo:base/Float"; // import Float

actor DBank{
  // Stable makes the app retain the variable value even after deployment (Orthogonal Persistance).
  stable var curBal: Float = 0; // Use camelCase for Constants and PascalCase for Variables.
  // curBal:= 0;

  //Time.now() returns nanoseconds passed after 1st Jan, 1970.
  stable var startTime = Time.now();
  // startTime := Time.now();

  stable var rate: Float = 0;
  // rate := 0;

  // Function to take care of Deposists
  public func deposit(depAmt: Float): async Text {
    curBal+=depAmt;
    Debug.print(debug_show(curBal));   //debug_show is used to print NAT/INT values as Debug.print expects Text
    return("Success: Deposited $" # debug_show(depAmt));
  };
  
  // Function to take care of Withdrawals
  public func withdraw(witAmt: Float): async Text {
    // Check whether user has enough Balance to execute this transaction
    if (curBal>=witAmt){
      curBal-=witAmt;
      Debug.print(debug_show(curBal));
      return("Success: Withdrew $" # debug_show(witAmt));
    }
    else {
      Debug.print("Error: Not Enough Balance");
      return("Error: Not Enough Balance")
    }
  };
  
  // Funtion to show Balance
  public query func checkBal(): async Float {   //Query vs Update: Query is faster and used for readonly functions.
    Debug.print(debug_show(curBal));
    return(curBal);
  };

  // Function to return Rate
  public query func getRate(): async Float {
    Debug.print(debug_show(rate));
    return(rate);
  };

  // Function to update Rate
  public func updateRate(newrate: Float) {
    rate:= newrate;
  };

  // Function to calculate Amount
  public func amount() {
    let timeinsec= Float.fromInt(Time.now()-startTime)/1000000000;
    curBal:=curBal*((1+(rate/100))**(timeinsec/60));
    startTime:= Time.now();
  }
}