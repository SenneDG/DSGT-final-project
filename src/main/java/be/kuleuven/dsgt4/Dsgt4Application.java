package be.kuleuven.dsgt4;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.hateoas.config.HypermediaWebClientConfigurer;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Objects;

@EnableHypermediaSupport(type = EnableHypermediaSupport.HypermediaType.HAL)
@SpringBootApplication
public class Dsgt4Application {



	@SuppressWarnings("unchecked")
	public static void main(String[] args)  {
		//System.setProperty("server.port", System.getenv().getOrDefault("PORT", "8080"));
		SpringApplication.run(Dsgt4Application.class, args);

	}

	@Bean
	public WebMvcConfigurer configure() {
		return new WebMvcConfigurer() {
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				registry.addResourceHandler("/**")
						.addResourceLocations("classpath:/static/dsgt-frontend/build/");
			}
		};
	}

	@Bean
	public boolean isProduction() {
		return Objects.equals(System.getenv("GAE_ENV"), "standard");
	}

	@Bean
	public String projectId() {
		if (this.isProduction()) {
			return "dsgt-3e54a";
		} else {
			return "dsgt-3e54a";
		}
	}
	@Bean
	public Firestore db() throws IOException {
		Firestore firestore;
		if (isProduction()) {
			GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream("src/main/java/credentials.json"));
			firestore = FirestoreOptions.getDefaultInstance()
					.toBuilder()
					.setProjectId(this.projectId())
					.setCredentials(credentials)
					.build()
					.getService();
		} else {
			firestore = FirestoreOptions.getDefaultInstance()
					.toBuilder()
					.setProjectId(this.projectId())
					.setCredentials(new FirestoreOptions.EmulatorCredentials())
					.setEmulatorHost("localhost:8084")
					.build()
					.getService();
		}
		return firestore;
	}
	/*
	 * You can use this builder to create a Spring WebClient instance which can be used to make REST-calls.
	 */
	@Bean
	WebClient.Builder webClientBuilder(HypermediaWebClientConfigurer configurer) {
		return configurer.registerHypermediaTypes(WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
				.codecs(clientCodecConfigurer -> clientCodecConfigurer.defaultCodecs().maxInMemorySize(100 * 1024 * 1024)));
	}

	@Bean
	HttpFirewall httpFirewall() {
		DefaultHttpFirewall firewall = new DefaultHttpFirewall();
		firewall.setAllowUrlEncodedSlash(true);
		return firewall;
	}
}
