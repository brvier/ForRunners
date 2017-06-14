/**
 * Kalman Filter constructor
 * The filter is modeled after Newton's laws of motion
 * @param {float} rate  		-> system sampling rate
 *		  {float} pnoise		-> process noise
 *		  {float} mnoise 		-> measurement noise	
 */

function KalmanFilter(rate, pnoise, mnoise) {
	// state transition matrix
    this.F = math.matrix([[1, rate], [0,1]]);
    // input control matrix
    this.G = math.matrix([[math.square(rate)/2],[rate]]);
    // measurement model
    this.H = math.matrix([1, 0]);
    // process noise
    this.Q = math.multiply(math.multiply(this.G, math.transpose(this.G)), pnoise);
    // measurement noise
    this.R = mnoise;
    // covariance matrix
    this.P = this.Q;
}


/**
 * Get Kalman next filtered value
 * @param float m  	-> input coordinate to be filtered
 * @return float
 */
KalmanFilter.prototype.update = function(m) {
	if (!this.X) {
		this.X =  math.matrix([[m],[0]]);
	}
	// prediction: X = F * X  |  P = F * P * F' + Q
	this.X = math.multiply(this.F, this.X);
	this.P = math.add(math.multiply(math.multiply(this.F,this.P), math.transpose(this.F)), this.Q); 
	// kalman multiplier: K = P * H' * (H * P * H' + R)^-1
	var K = math.multiply(math.multiply(this.P, math.transpose(this.H)), math.inv(math.add(math.multiply(math.multiply(this.H, this.P), math.transpose(this.H)), this.R)));
	// correction: X = X + K * (m - H * X)  |  P = (I - K * H) * P
	this.X = math.add(this.X, math.multiply(K, math.subtract(m, math.multiply(this.H,this.X))));
	this.P = math.multiply(math.subtract(math.eye(2), math.multiply(K, this.H)), this.P);

	return this.X._data[0];
}