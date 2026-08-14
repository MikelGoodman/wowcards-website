<?php
/**
 * WOW CARDS quote stub.
 * Logs the quote and tries PHP mail() if it works.
 * No SMTP passwords. No invented mail host.
 */
declare(strict_types=1);

function field(string $key): string {
    $raw = $_POST[$key] ?? '';
    if (is_array($raw)) {
        return '';
    }
    return trim((string) $raw);
}

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Honeypot — pretend success for bots
if (field('website') !== '') {
    header('Location: quote-submit.php?ok=1');
    exit;
}

$name     = field('name');
$business = field('business');
$email    = field('email');
$phone    = field('phone');
$notes    = field('notes');
$product  = field('product');
$qty      = field('qty');
$total    = field('total');
$extras   = field('extras');
$perCard  = field('per_card');
$page     = field('page');

$errors = [];
if ($name === '') {
    $errors[] = 'Name is required.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A real email is required.';
}
if ($phone === '') {
    $errors[] = 'Phone is required.';
}

$when = date('c');
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

$body = "WOW CARDS quote request\n"
    . "Sent: {$when}\n"
    . "Page: {$page}\n"
    . "IP: {$ip}\n\n"
    . "Name: {$name}\n"
    . "Business: {$business}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Notes: {$notes}\n\n"
    . "Product: {$product}\n"
    . "Quantity: {$qty}\n"
    . "Total: {$total} AUD (GST and free AU delivery included)\n"
    . "Per card: {$perCard}\n"
    . "Extras: {$extras}\n";

$logLine = $when . "\t" . str_replace(["\r", "\n"], [' ', ' | '], $body) . "\n";
@file_put_contents(__DIR__ . '/quote-log.txt', $logLine, FILE_APPEND | LOCK_EX);

$sent = false;
if (!$errors && function_exists('mail')) {
    $to = 'info@pr.com.au';
    $subject = 'WOW CARDS quote — ' . $product . ' x ' . $qty;
    $headers = [
        'From: WOW CARDS <info@pr.com.au>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: WOW-CARDS-staging',
    ];
    $sent = @mail($to, $subject, $body, implode("\r\n", $headers));
}

$mailto = 'mailto:info@pr.com.au?subject=' . rawurlencode('WOW CARDS quote — ' . $product . ' x ' . $qty)
    . '&body=' . rawurlencode($body);

$ok = empty($errors);
$title = $ok ? 'Quote sent — thanks' : 'Almost there';
?><!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?php echo h($title); ?> | WOW CARDS</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div class="wrap header-row">
      <a class="brand" href="index.html"><img src="assets/logo-header.jpeg" alt="WOW CARDS .com.au"></a>
      <a class="phone-pill" href="tel:1800801901">1800 801 901</a>
    </div>
  </header>
  <main class="hero">
    <div class="wrap" style="max-width:720px">
      <div class="calc-card">
        <?php if ($ok): ?>
          <h1>Got it.</h1>
          <p class="hint">Thanks<?php echo $name !== '' ? ', ' . h($name) : ''; ?>. Your quote is logged for PR Australia in Terrigal.
            <?php if ($sent): ?>
              An email went to <a href="mailto:info@pr.com.au">info@pr.com.au</a>.
            <?php else: ?>
              The server could not send mail from here. Your details are still logged.
              <a href="<?php echo h($mailto); ?>">Tap to email the same quote yourself</a>.
            <?php endif; ?>
          </p>
          <ul class="breakdown" style="color:#2a1058">
            <li><span>Product</span><span><?php echo h($product); ?></span></li>
            <li><span>Quantity</span><span><?php echo h($qty); ?></span></li>
            <li><span>Total</span><span><?php echo h($total); ?></span></li>
            <li><span>Per card</span><span><?php echo h($perCard); ?></span></li>
            <li><span>Extras</span><span><?php echo h($extras); ?></span></li>
          </ul>
        <?php else: ?>
          <h1>Need a couple of details</h1>
          <p class="hint"><?php echo h(implode(' ', $errors)); ?></p>
        <?php endif; ?>
        <p style="margin-top:22px">
          <a class="btn btn-lime" href="index.html#calc">Back to the calculator</a>
        </p>
      </div>
    </div>
  </main>
</body>
</html>
