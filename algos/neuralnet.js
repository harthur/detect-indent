var brain = require("brain"),
    fs = require("fs"),
    path = require("path");

var dir = "train";

var netJSON = trainNetwork();
console.log("network:", JSON.stringify(netJSON));

const NET = {"layers":[{"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"8":{},"9":{},"10":{},"11":{},"12":{},"13":{},"14":{},"16":{},"20":{},"24":{},"tabs":{}},{"0":{"bias":-0.3014487678945164,"weights":{"1":0.1331172867702772,"2":-3.8062655993975483,"3":-1.934049942720419,"4":0.840623545086433,"5":1.0369913624439921,"6":-2.92036329850133,"8":3.3144075945251514,"9":-0.011877606461757846,"10":1.1370938125026635,"11":0.6056618835336806,"12":1.9814535233189445,"13":0.1158298450420822,"14":-0.016385047097283986,"16":1.4481164965966165,"20":0.7300982237509497,"24":0.2760079299264107,"tabs":2.1923785772607336}},"1":{"bias":1.1052523235423175,"weights":{"1":-0.05165307995941238,"2":-5.415700819159882,"3":-1.972155170570692,"4":-2.320447393953704,"5":0.6621376423781395,"6":-3.5218272423893313,"8":-0.10935632258674052,"9":0.010915620790405969,"10":0.31182491829606174,"11":0.9056519538498357,"12":-1.0375129611559586,"13":0.22232230837210584,"14":-0.3436417029235057,"16":-1.0489521547083267,"20":-0.8214054606305249,"24":-0.26783070948198634,"tabs":1.9172808200334774}},"2":{"bias":-1.2652362516966615,"weights":{"1":0.443286047672885,"2":3.456736338664597,"3":6.309547316785219,"4":0.5863709022403671,"5":1.0804152968606342,"6":2.4627479716274263,"8":-2.429715431982306,"9":0.07322228753021558,"10":-0.4878567909265313,"11":0.569471803883889,"12":-0.552184766561055,"13":0.20974071720759416,"14":0.26815287285420814,"16":-0.5628179084471611,"20":-0.2597370907721759,"24":0.010309035196595994,"tabs":3.342706493786564}},"3":{"bias":1.075716443958958,"weights":{"1":-0.3627988748197503,"2":5.486584273757589,"3":-3.7146696535554753,"4":-2.794320012820392,"5":-2.4911038337934706,"6":3.318073819713916,"8":-4.783611690872893,"9":-0.18710801939261046,"10":-1.8452867182549588,"11":-1.5669637746824883,"12":-3.35962533260292,"13":-0.4765281321028238,"14":0.25497399110972707,"16":-2.489451839006746,"20":-1.877807941691182,"24":-0.11258457916622804,"tabs":-3.9471805757718275}},"4":{"bias":-0.2773882440747027,"weights":{"1":0.3121003148428773,"2":-0.7147564851241901,"3":-1.061226487863491,"4":-1.965700170578866,"5":2.0372736615152522,"6":-1.112807238577403,"8":-1.508129266217268,"9":0.0989080620600194,"10":-0.07064876051267477,"11":1.0439998847253202,"12":0.07353365007292142,"13":0.23512379821808013,"14":-0.005428982668108269,"16":-0.7716958833630669,"20":-0.6084599498311885,"24":-0.11299627379648385,"tabs":4.683134179015472}},"5":{"bias":-1.6003507482122483,"weights":{"1":0.18175257153189694,"2":2.789917790432191,"3":-3.212857057083802,"4":2.6125264741161565,"5":-0.4438733439546774,"6":1.4294153365286728,"8":4.507199371032203,"9":0.13409675100178092,"10":0.7958706518196536,"11":-0.6138305870751675,"12":2.7050480976681612,"13":-0.4055769745949237,"14":0.017998294835668702,"16":2.9181860020576513,"20":1.9470768618224121,"24":0.393563707228333,"tabs":-3.5061657136676385}},"6":{"bias":-0.6509991422781992,"weights":{"1":-0.23700292407353268,"2":3.0794040208176123,"3":-0.9551004212963451,"4":0.7801251653627962,"5":-1.1540272901230417,"6":2.002017345040893,"8":0.9955777513310897,"9":0.09818965173977279,"10":-0.03506798660800233,"11":-0.8643364443655414,"12":0.26437189246544257,"13":-0.27763055952732263,"14":-0.01937096391940603,"16":0.549181583560873,"20":0.5299781125349438,"24":-0.13324843260937794,"tabs":-1.2672478751282015}},"7":{"bias":-1.4885288622004555,"weights":{"1":0.4155692143689701,"2":6.348689530056197,"3":-2.1788920075197757,"4":0.543129420004269,"5":0.9333513256802497,"6":4.3412015196494655,"8":-0.8584113512911775,"9":0.34387083436227145,"10":-0.2634374539931034,"11":-0.1383276673607699,"12":0.6595420175324855,"13":0.12271355517185774,"14":0.30448620859800457,"16":0.5083684045283067,"20":0.012781204270713413,"24":-0.13224597084175815,"tabs":3.9996334294667935}}},{"0":{"bias":0.40550404220612735,"weights":{"0":-1.751781463555102,"1":4.0111306933823005,"2":-5.2182386483513445,"3":6.3880822881551085,"4":-0.6979363871369311,"5":-4.77713947065689,"6":-1.4224155237850558,"7":-5.342577588054263}},"2":{"bias":-2.8190253679077406,"weights":{"0":-5.463456062638359,"1":-6.387581830672371,"2":0.33857486469667636,"3":5.846542795536036,"4":-2.1750178312238853,"5":0.9904750566893051,"6":1.8804319998965124,"7":5.380941811055706}},"3":{"bias":1.3618345222225712,"weights":{"0":-2.210778530801853,"1":-2.181128579292836,"2":5.4158402041396485,"3":-2.9050803647924464,"4":-2.8281694016698986,"5":-2.782217883123414,"6":-0.8971679403411621,"7":-4.917225712066509}},"4":{"bias":0.37240381690978447,"weights":{"0":4.244809319447975,"1":0.013627915433833387,"2":-6.324013392864711,"3":-5.931665184488497,"4":-3.3493296161109742,"5":6.052505824363108,"6":0.6888607365499213,"7":-3.484471991514916}},"tabs":{"bias":-2.1922485217078123,"weights":{"0":1.6634454665268679,"1":3.313536157700562,"2":-0.2273991499051587,"3":-5.3889846390687115,"4":3.7853462401663327,"5":-4.959748767747609,"6":-3.761762034533515,"7":-1.8709910698914056}}}],"outputLookup":true,"inputLookup":true}
module.exports = function(lines) {
  var spaces = getWidthCounts(lines);

  var net = new brain.NeuralNetwork().fromJSON(NET);
  var result = net.run(spaces);

  console.log("result:", result);

  var maxProb = 0, bestIndent = null;
  for (var width in result) {
    var prob = result[width];
    if (prob > maxProb) {
      bestIndent = width;
      maxProb = prob;
    }
  }
  if (bestIndent == 0) {
    return null;
  }
  console.log("best:", bestIndent);
  return bestIndent;
}


function trainNetwork() {
  var data = [];
  var files = fs.readdirSync(dir);

  for (var j in files) {
    var file = path.join(dir, files[j]);
    var indent = getIndent(file);
    var contents = fs.readFileSync(file, { encoding: "utf-8"});
    var lines = contents.split("\n");

    var counts = getWidthCounts(lines);
    var output = {};
    output[indent] = 1;
    console.log("input", counts);
    console.log("output", output);
    data.push({input: counts, output: output});
  }

  console.log("training network");

  var net = new brain.NeuralNetwork();
  var stats = net.train(data);

  console.log("trained", stats);

  return net.toJSON();
}

function getWidthCounts(lines) {
  var widths = {};  // # spaces -> # lines with that many spaces
  var total = 0;    // # of indented lines

  // count up number of lines using each type of indentation
  lines.forEach(function (text) {
    if (text[0] == "\t") {
      widths["tabs"] = (widths["tabs"] || 0) + 1;
      total++;
      return;
    }
    var i = 0;
    while (text[i] === " ") {
      i++;
    }
    if (i == 0 || i == text.length) {
      return;
    }
    widths[i] = (widths[i] || 0) + 1;
    total++;
  });

  for (var width in widths) {
    widths[width] = widths[width] / total;
  }
  // TODO divide by total to normalize btw 0 and 1
  return widths;
}

function getIndent(filename) {
  if (/-tabs\./.test(filename)) {
    return "tabs";
  }

  var matches = filename.match(/-(\d)\./);
  if (!matches) {
    return 0;
  }
  var spaces = parseInt(matches[1] || "0");
  return spaces || 0;
}
