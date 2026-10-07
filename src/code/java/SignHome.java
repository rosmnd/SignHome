/**
 * SignHome — ASL letters L, A, F, V, W mapped to Arduino Uno R3 pins.
 *
 * Geometry classifier twin of the browser pipeline. 21 MediaPipe Hands
 * landmarks, signer view, palm toward the camera.
 */
public final class SignHome {

  public enum Gesture {
    LIGHTS_ON("L", '1', "D2", "on"),
    LIGHTS_OFF("A", '2', "D2", "off"),
    FAN_ON("F", '3', "D3", "on"),
    FAN_OFF("V", '4', "D3", "off"),
    AUX("W", '5', "D4", "toggle");

    public final String asl;
    public final char serial;
    public final String pin;
    public final String action;

    Gesture(String asl, char serial, String pin, String action) {
      this.asl = asl;
      this.serial = serial;
      this.pin = pin;
      this.action = action;
    }
  }

  public static final class Landmark {
    public final double x, y, z;

    public Landmark(double x, double y, double z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  private static double dist(Landmark a, Landmark b) {
    double dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private static double[] finger(Landmark[] lm, int tip, int pip, int mcp) {
    Landmark wrist = lm[0];
    double dTip = dist(lm[tip], wrist);
    double dPip = dist(lm[pip], wrist);
    double dMcp = dist(lm[mcp], wrist);
    double linear = dTip / (dPip + 1e-6);
    double radial = dTip / (dMcp + 1e-6);
    double image = (lm[pip].y - lm[tip].y) / (dist(lm[mcp], lm[pip]) + 1e-6);
    double score = 0.45 * (linear - 1) + 0.25 * (radial - 1.15) + 0.3 * image;
    return new double[] {score > 0.12 ? 1 : 0, score};
  }

  private static double[] thumb(Landmark[] lm) {
    double palm = dist(lm[0], lm[9]);
    if (palm == 0) palm = 1;
    double spread = dist(lm[4], lm[5]) / palm;
    double reach = dist(lm[4], lm[17]) / palm;
    double score = 0.8 * (spread - 0.7) + 0.2 * (reach - 0.9);
    return new double[] {score > 0 ? 1 : 0, score};
  }

  /** Classify 21 landmarks into L / A / F / V / W, or null. */
  public static Gesture classify(Landmark[] lm) {
    if (lm == null || lm.length < 21) return null;
    double[] th = thumb(lm);
    double[] ix = finger(lm, 8, 6, 5);
    double[] md = finger(lm, 12, 10, 9);
    double[] rg = finger(lm, 16, 14, 13);
    double[] pk = finger(lm, 20, 18, 17);
    boolean t = th[0] == 1, i = ix[0] == 1, m = md[0] == 1, r = rg[0] == 1, p = pk[0] == 1;

    Gesture best = null;
    double bestScore = Double.NEGATIVE_INFINITY;

    if (t && i && !m && !r && !p) {
      double s = (th[1] + ix[1] - md[1] - rg[1] - pk[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.LIGHTS_ON; }
    }
    if (!i && !m && !r && !p && !t) {
      double s = (-ix[1] - md[1] - rg[1] - pk[1] - th[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.LIGHTS_OFF; }
    }
    if (!i && m && r && p) {
      double s = (-ix[1] + md[1] + rg[1] + pk[1]) / 4;
      if (s > bestScore) { bestScore = s; best = Gesture.FAN_ON; }
    }
    if (i && m && !r && !p && !t) {
      double s = (ix[1] + md[1] - rg[1] - pk[1] - th[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.FAN_OFF; }
    }
    if (i && m && r && !p && !t) { // W
      double s = (ix[1] + md[1] + rg[1] - pk[1] - th[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.AUX; }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println("SignHome letters: L A F V W");
    for (Gesture g : Gesture.values()) {
      System.out.printf("%s  serial=%c  pin=%s  %s%n", g.asl, g.serial, g.pin, g.action);
    }
  }
}
